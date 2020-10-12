n = 600_851_475_143
i = 2
factors = []

while i <= n do
  if n%i == 0
    n /= i
    factors << i
  else
    i += 1
  end
end


puts "Problem 3: #{factors.sort}"
