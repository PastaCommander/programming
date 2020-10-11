sum = 0
a = 0
b = 1

loop do
    n = a + b
    a = b
    b = n
    break if n > 4_000_000
    sum += n if n%2 == 0
end

puts "Problem 2: #{sum}"
