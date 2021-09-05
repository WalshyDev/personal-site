-----
title: Why is Java 11's String repeat SO QUICK
description: Let's dig into why Java 11's String#repeat method is so quick compared to normal util methods!
-----

# Why is Java 11's String repeat SO QUICK

For a long time people have been making their own util methods for repeating a character or a sequence of characters. How would you do it? String concat? StringBuilder + for loop? Array fill? So does everyone else. With that in mind though, why is [String#repeat()](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/String.html#repeat(int)) so much quicker? What is this sorcery? Well, in this blog post we'll dig into it!
Today we'll be digging into single char repeating, it's the most common usage and my exact usage as to what prompted this blog post.

## The Timings
Before we dig into the code of `String.java` let's compare some timings:  
> Note: Timings done with [jmh](https://github.com/openjdk/jmh). Benchmark mode: Throughput, 2 Warmup Iterations and 1 Fork.

The code:
```java
public class MyBenchmark {

    @Benchmark
    public void stringRepeat(Blackhole blackhole) {
        blackhole.consume("*".repeat(50));
    }

    // By the way, this is very bad. Don't do this <3
    @Benchmark
    public void repeatWithStringConcat(Blackhole blackhole) {
        String s = "";

        for (int i = 0; i < 50; i++) {
            s += "*";
        }

        blackhole.consume(s);
    }

    @Benchmark
    public void repeatWithStringBuilder(Blackhole blackhole) {
        final StringBuilder sb = new StringBuilder();

        for (int i = 0; i < 50; i++) {
            sb.append('*');
        }

        blackhole.consume(sb.toString());
    }

    @Benchmark
    public void repeatWithArraysFill(Blackhole blackhole) {
        final char c = '*';
        final char[] chars = new char[50];

        Arrays.fill(chars, c);

        blackhole.consume(new String(chars));
    }
}
```

The results:
```
Benchmark                             Mode  Cnt         Score         Error  Units
MyBenchmark.repeatWithArraysFill     thrpt    5  36391425.045 ± 1799053.802  ops/s
MyBenchmark.repeatWithStringBuilder  thrpt    5  14035510.440 ±  323791.700  ops/s
MyBenchmark.repeatWithStringConcat   thrpt    5   1969762.456 ±   49203.994  ops/s
MyBenchmark.stringRepeat             thrpt    5  73366664.415 ± 3612541.640  ops/s
```

## Why is it so quick?
As we can see, the native String repeat is about twice as quick as Arrays.fill (which is the recommended way to do this pre-Java 9). What is this magic? Let's look toegether.

If we take a look at [the method](https://github.com/openjdk/jdk/blob/329697b02ee66b5bb767634dbf3ba19f6624c8d3/src/java.base/share/classes/java/lang/String.java#L4353-L4381), we see it's pretty simple:
```java
public String repeat(int count) {
    if (count < 0) {
        throw new IllegalArgumentException("count is negative: " + count);
    }
    if (count == 1) {
        return this;
    }
    final int len = value.length;
    if (len == 0 || count == 0) {
        return "";
    }
    if (Integer.MAX_VALUE / count < len) {
        throw new OutOfMemoryError("Required length exceeds implementation limit");
    }
    if (len == 1) {
        final byte[] single = new byte[count];
        Arrays.fill(single, value[0]);
        return new String(single, coder);
    }
    ...
}
```
We have a negative check, validation is important in a language or public library. Then if the count is 1 basically meaning don't repeat it, then it will just return itself. Simple 0 length check, if the String is empty or the count is 0 then just return an empty String. Checking the count vs length and throwing an error.

Now we are at the actual repeating part, since we just want to repeat a '\*' that `if (len == 1) {` block is for us. Let's take a closer look at that code:
```java
final byte[] single = new byte[count];
Arrays.fill(single, value[0]);
return new String(single, coder);
```

First, we make a byte array with the size of the supplied count. Next, we're filling the array with the first character in the string (which is a star). Lastly, we're making a String.
Pretty simple right? But wait... what is that `coder` variable being passed to String?

Well, this is where the magic begins!

Normal implementations will be doing `new String(array)` whereas the code here is doing `new String(array, coder)`. That `coder` variable is clearly speeding this up massively, so what is it?
```java
/**
 * The identifier of the encoding used to encode the bytes in
 * {@code value}. The supported values in this implementation are
 *
 * LATIN1
 * UTF16
 *
 * @implNote This field is trusted by the VM, and is a subject to
 * constant folding if String instance is constant. Overwriting this
 * field after construction will cause problems.
 */
private final byte coder;
```

So, this `byte` is a identifier for an encoding. Now let's look at where this is used:
```java
String(byte[] value, byte coder) {
    this.value = value;
    this.coder = coder;
}
```

Fair enough, it's a package-private constructor which just sets the internal byte[] and `coder`. What is the constructor that we mere peasants call?
```java
String(char[] value, int off, int len, Void sig) {
    if (len == 0) {
        this.value = "".value;
        this.coder = "".coder;
        return;
    }
    if (COMPACT_STRINGS) {
        byte[] val = StringUTF16.compress(value, off, len);
        if (val != null) {
            this.value = val;
            this.coder = LATIN1;
            return;
        }
    }
    this.coder = UTF16;
    this.value = StringUTF16.toBytes(value, off, len);
}
```

The `String(char[])` constructor calls this, another package-private one. We can see that `coder` is being set to either LATIN1 (0) or UTF16 (1). We can also see that if `COMPACT_STRINGS` is true then this will compress a UTF-16 string into LATIN1. I won't go into the compress code but if you want to see it [then you can here](https://github.com/openjdk/jdk/blob/b49c5893409879bbfecbf60127a512bcc48d087c/src/java.base/share/classes/java/lang/StringUTF16.java#L160-L166).

It makes perfect sense. They already have the character as a byte, they fill the byte array and skip the compression. Meanwhile, we need to do this compression as we have a UTF-16 String.

## Compact Strings
If you're interested in what that `COMPACT_STRINGS` is then we can have a quick look but I wont go too deep into it and I recommend you do your own research. [See the JEP](https://openjdk.java.net/jeps/254).

They were added in Java 9 and if we take a [look at the code](https://github.com/openjdk/jdk/blob/329697b02ee66b5bb767634dbf3ba19f6624c8d3/src/java.base/share/classes/java/lang/String.java#L183-L224) there is a very nice comment explaining if this is disabled Strings are always encoded with UTF-16 (this is true pre-Java 9!). So, basically, if true it will encode String internally with Latin-1 rather than UTF-16. This provides a benefit for heap space as it's using an 8-bit character set.

My question then was, when is this ever false? Well, there is a JVM argument to disable this exact thing, `-XX:-CompactStrings`. Otherwise, the only time it's disabled is if the used characters cannot simply be encoded with Latin-1, in that case it will use UTF-16.

## Conclusion
Since Java 9 implemented Latin-1 compression in String new Strings will need to be compressed to use this encoding, this adds additional overhead which cannot be avoided by the normal user but can in Java's own code. They instead use their `coder` variable which signals the encoding of the current String. They just pass that instead of compressing or decoding.

If you're wondering what the timings are in Java 8, here they are:
```
Benchmark                             Mode  Cnt         Score        Error  Units
MyBenchmark.repeatWithArraysFill     thrpt    5  41988725.789 ± 732901.857  ops/s
MyBenchmark.repeatWithStringBuilder  thrpt    5   7905583.881 ±  92477.961  ops/s
MyBenchmark.repeatWithStringConcat   thrpt    5   2156015.552 ± 107153.092  ops/s
```
Arrays.fill does seem to be on-par or slightly quicker than native 👀 but obviously, this suffers from more memory hungry strings.

Overall, if you're using Java 11 (current LTS) or any above 9, use [String.repeat](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/String.html#repeat(int)), if you're on Java 8, use [Arrays.fill](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/Arrays.html#fill(char%5B%5D,char)).