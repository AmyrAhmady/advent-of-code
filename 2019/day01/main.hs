main = do
    input <- readFile "input.txt"
    putStrLn "Part1 answer: " 
    print (part1 (massArr input))
    putStrLn "Part2 answer: "
    print (part2 (massArr input))
    where
        massArr input = map (\i -> read i :: Int) (words input)

part1 input = sum (map fuel input)
part2 input = sum (map fuelFull input)

fuel mass = (quot mass 3) - 2

fuelFull mass =
    (fuel mass) + (f4F (fuel mass))
    where
        f4F i =
            if result <= 0 then
                0
            else
                result + (f4F result)
            where
                result = fuel i