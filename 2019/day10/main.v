module main

import os
import math

struct StructAsteroid {
    mut:
        x int
        y int
        dist f64
        boom bool
        angle f64
}

fn get_map_grid(lines[] string, width int, height int) []byte {
    mut grid := [`.`].repeat(width * height)
    for j, line in lines 
    {
        for i, c in line.split('') 
        {
            if c != '#' { continue }
            idx := i + j * width
            grid[idx] = `#`
        }
    }
    return grid
}

fn get_all_asteroids(lines[] string, width int, height int) []StructAsteroid {
    grid := get_map_grid(lines, width, height)
    mut positions := []StructAsteroid
    for i, a in grid {
        if a != `#` { continue }
        pos := StructAsteroid {
            x: i % width
            y: i / width
            dist: 0.0
            boom: false
            angle: 0.0
        }
        positions << pos
    }
    return positions
}

fn get_asteroid_angles(pos1 StructAsteroid, pos2 StructAsteroid) f64 {
    mut ret := math.atan2(pos2.x - pos1.x, - (pos2.y - pos1.y))
    for ret < 0 
    {
        ret += math.pi * 2.0
    }
    for ret >= math.pi * 2.0 
    {
        ret -= math.pi * 2.0
    }
    return ret
}

fn get_asteroid_distance(pos1 StructAsteroid, pos2 StructAsteroid) f64 {
    return math.sqrt(math.pow(pos2.x - pos1.x, 2) + math.pow(pos2.y - pos1.y, 2))
}

fn do_part_one(asteroids[] StructAsteroid) int {
    mut max := 0
    for asteroid1 in asteroids
    {
        mut grads := []f64
        for asteroid2 in asteroids
        {
            if (asteroid1.x != asteroid2.x || asteroid1.y != asteroid2.y)
            {
                angle := get_asteroid_angles(asteroid1, asteroid2)
                checks := grads.filter(it == angle)
                if checks.len == 0 {
                    grads << angle
                }
            }
        }
        if grads.len > max
        {
            max = grads.len
        }
    }
    return max
}

pub fn main() 
{
    lines := os.read_lines('input.txt') or { panic(err) }
    width := lines[0].len
    height := lines.len
    asteroid_positions := get_all_asteroids(lines, width, height)
    result := do_part_one(asteroid_positions) 

    print("Part1 answer: ")
    println(result)
}