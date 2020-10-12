
biggest_pal = 0

def palindrome?(s)
  arr = s.chars
  i = 0
  j = arr.length - 1

  while i < j
    return false if arr[i] != arr[j]
    i += 1
    j -= 1
  end

  return true
end

(100..999).each do |x|
  (100..999).each do |y|
    prod = x*y
    if prod > biggest_pal && palindrome?(prod.to_s)
      biggest_pal = prod
    end
  end
end


puts "Problem 4: #{biggest_pal}"
