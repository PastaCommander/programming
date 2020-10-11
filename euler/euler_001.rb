
sum = 0

(0...1000).each do |i|
  # if i%3 == 0 || i%5 == 0
  #   sum += i
  # end

  next if i%3 > 0 && i%5 > 0

  sum += i
end

puts "Problem 1: #{sum}"
