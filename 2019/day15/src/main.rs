use std::collections::HashMap;
use std::collections::HashSet;

#[derive(Clone, Copy)]
enum Dir  {
    N, S, W, E
}

#[derive(PartialEq, Clone, Copy)]
enum Status {
    Wall,
    Free,
    Oxygen
}

fn step(droid: &mut intcode::Process, dir: Dir) -> Status {
    let mut status = None;
    while status ==  None {
        droid.step(
            |x| {
                status = match x {
                    0 => Some(Status::Wall),
                    1 => Some(Status::Free),
                    2 => Some(Status::Oxygen),
                    _ => panic!("wrong status")
                };
            },
            || match dir {
                Dir::N => 1,
                Dir::S => 2,
                Dir::W => 3,
                Dir::E => 4,
            }
        );
    }
    status.unwrap()
}


fn visit(droid: &mut intcode::Process, map: &mut HashMap<(isize,isize), Status>, pos: (isize,isize)) {
    for dir in &[Dir::E, Dir::N, Dir::W, Dir::S] {
        let new_pos = match dir {
            Dir::N => (pos.0, pos.1 - 1),
            Dir::S => (pos.0, pos.1 + 1),
            Dir::W => (pos.0 - 1, pos.1),
            Dir::E => (pos.0 + 1, pos.1)
        };

        if !map.contains_key(&new_pos) {
            let status = step(droid, *dir);

            map.insert(new_pos, status);
            if status != Status::Wall {
                visit(droid, map, new_pos);

                step(droid, match *dir {
                    Dir::N => Dir::S,
                    Dir::S => Dir::N,
                    Dir::W => Dir::E,
                    Dir::E => Dir::W
                });
            }
        }
    }
}

fn explore(program: &[isize]) -> HashMap<(isize,isize), Status> {
    let mut droid = intcode::Process::new(program);
    let mut map: HashMap<(isize, isize), Status> = HashMap::new();
    map.insert((0,0), Status::Free);
    visit(&mut droid, &mut map, (0,0));
    map
}

fn adjacent(pos: &(isize, isize)) -> [(isize,isize); 4] {
    [
        (pos.0, pos.1 - 1),
        (pos.0, pos.1 + 1),
        (pos.0 - 1, pos.1),
        (pos.0 + 1, pos.1)
    ]
}

fn part_one(map: &HashMap<(isize, isize), Status>) -> usize {
    let mut visited = HashSet::new();

    std::iter::successors(Some(vec![(0,0)]), |positions| {
        let mut next_positions = Vec::new();
        for pos in positions {
            if visited.contains(pos) {
                continue;
            }
            visited.insert(pos.clone());

            for next_pos in &adjacent(&pos) {
                match map.get(&next_pos) {
                    Some(Status::Free)   => next_positions.push(*next_pos),
                    Some(Status::Oxygen) => return None,
                    _                    => {}
                }
            }
        }
        Some(next_positions)
    }).count()
}

fn part_two(mut map: HashMap<(isize,isize), Status>) -> usize {
    let oxygen_pos = map.iter()
        .find(|(_,&status)| status == Status::Oxygen)
        .unwrap().0;

    std::iter::successors(Some(vec![*oxygen_pos]), |positions| {
        let mut next_positions = Vec::new();
        for pos in positions {
            for next_pos in &adjacent(&pos) {
                if let Some(Status::Free) = map.get(next_pos) {
                    next_positions.push(*next_pos);
                    map.insert(*next_pos, Status::Oxygen);
                }
            }
        }

        if !next_positions.is_empty() {
            Some(next_positions)
        } else {
            None
        }
    }).count() - 1
}


fn main() {
    let input = std::fs::read_to_string("input.txt")
        .expect("can't read input.txt");

    let program = intcode::parse(input.trim_end())
        .expect("can't parse input file");

    let map = explore(&program);

    println!("Part1 answer: {}", part_one(&map));
    println!("Part2 answer: {}", part_two(map));
}