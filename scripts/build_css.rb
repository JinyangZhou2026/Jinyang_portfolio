#!/usr/bin/env ruby

source_path = File.expand_path("../styles.css", __dir__)
output_path = File.expand_path("../styles.min.css", __dir__)
source = File.read(source_path, encoding: "UTF-8")

output = +""
pending_space = false
index = 0
punctuation = [123, 125, 58, 59, 44, 62]
whitespace = [9, 10, 12, 13, 32]

while index < source.bytesize
  character = source.getbyte(index)
  following = source.getbyte(index + 1)

  if character == 47 && following == 42
    index += 2
    index += 1 while index < source.bytesize - 1 && !(source.getbyte(index) == 42 && source.getbyte(index + 1) == 47)
    index += 2
    next
  end

  if character == 34 || character == 39
    output << 32 if pending_space && !output.empty? && !punctuation.include?(output.getbyte(-1))
    pending_space = false
    quote = character
    output << character
    index += 1
    while index < source.bytesize
      output << source.getbyte(index)
      if source.getbyte(index) == 92 && index + 1 < source.bytesize
        index += 1
        output << source.getbyte(index)
      elsif source.getbyte(index) == quote
        break
      end
      index += 1
    end
  elsif whitespace.include?(character)
    pending_space = true
  elsif punctuation.include?(character)
    output.chop! while output.end_with?(" ")
    output << character
    pending_space = false
  else
    output << 32 if pending_space && !output.empty? && !punctuation.include?(output.getbyte(-1))
    output << character
    pending_space = false
  end

  index += 1
end

minified = output.force_encoding("UTF-8").gsub(/;}/, "}").strip

File.write(output_path, minified, encoding: "UTF-8")
puts "Built styles.min.css (#{source.bytesize} -> #{minified.bytesize} bytes)."
