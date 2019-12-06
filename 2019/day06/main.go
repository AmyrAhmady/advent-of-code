package main

import (
	"bufio"
	"fmt"
	"os"
	"strings"
)

func getTotalOrbits(orbitMap map[string]string) int {

	var totalOrbits = 0

	for orbiter := range orbitMap {
		var currentOrbiter = orbiter
		for orbitMap[currentOrbiter] != "" {
			totalOrbits++
			currentOrbiter = orbitMap[currentOrbiter]
		}
	}
	return totalOrbits
}

func getPathToCOM(orbitMap map[string]string, object string) map[string]int {

	var path map[string]int = make(map[string]int)
	var distance = 0
	var currentOrbiter = object

	for orbitMap[currentOrbiter] != "" {
		path[currentOrbiter] = distance
		currentOrbiter = orbitMap[currentOrbiter]
		distance++
	}
	return path
}

func distanceToSanta(orbitMap map[string]string) int {

	var minDistance = 4294967295
	var yourPath = getPathToCOM(orbitMap, "YOU")
	var santaPath = getPathToCOM(orbitMap, "SAN")

	for object, distance := range yourPath {
		if santaPath[object] != 0{
			var thisDistance = santaPath[object] + distance
			if thisDistance < minDistance {
				minDistance = thisDistance
			}
		}
	}
	return minDistance - 2
}

func main() {

    var orbitMap map[string]string = make(map[string]string)

	file, _ := os.Open("input.txt")
	defer file.Close()

	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		data := strings.Split(scanner.Text(), ")")
		orbitMap[data[1]] = data[0]
	}

	var totalOrbits = getTotalOrbits(orbitMap)
	fmt.Printf("Part1 answer: %d\n", totalOrbits)

	var dist = distanceToSanta(orbitMap)
	fmt.Printf("Part2 answer: %d", dist)
}