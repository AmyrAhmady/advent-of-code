use std::collections::HashMap;
use std::cell::{Cell, RefCell};
use intcode;

enum Dir {
    Left, Right, Up, Down
}


fn turn_left(dir: &Dir) -> Dir {
    match dir {
        Dir::Up => Dir::Left,
        Dir::Left => Dir::Down,
        Dir::Down => Dir::Right,
        Dir::Right => Dir::Up
    }
}


fn step(pos: &(isize, isize), dir: &Dir) -> (isize, isize) {
    match dir {
        Dir::Up => (pos.0, pos.1 - 1),
        Dir::Down => (pos.0, pos.1 + 1),
        Dir::Left => (pos.0 - 1, pos.1),
        Dir::Right => (pos.0 + 1, pos.1),
    }
}


fn run_robot(program: &[isize], initial_panels: &mut HashMap<(isize, isize), isize>) {
    let panels: RefCell<_> = RefCell::new(initial_panels);
    let pos: Cell<(isize, isize)> = Cell::new((0, 0));
    let mut dir = Dir::Up;

    let mut paint_on_output = true;

    let mut process = intcode::Process::new(program);
    process.run(
        |val| {
            if paint_on_output {
                panels.borrow_mut().insert(pos.get(), val);
            } else {
                if val == 0 {
                    dir = turn_left(&dir);
                } else if val == 1 {
                    dir = turn_left(&turn_left(&turn_left(&dir)));
                }
                pos.set(step(&pos.get(), &dir));
            };
            paint_on_output = !paint_on_output;
        },
        || *panels.borrow().get(&pos.get()).unwrap_or(&0)
    );
}


fn render(panels: &HashMap<(isize, isize), isize>) {
    let min_x = *panels.iter().map(|((x,_), _)| x).min().unwrap_or(&0);
    let max_x = *panels.iter().map(|((x,_), _)| x).max().unwrap_or(&0);
    let min_y = *panels.iter().map(|((_,y), _)| y).min().unwrap_or(&0);
    let max_y = *panels.iter().map(|((_,y), _)| y).max().unwrap_or(&0);

    for y in min_y..=max_y {
        for x in min_x..=max_x {
            let pos = (x as isize, y as isize);
            if panels.get(&pos).unwrap_or(&0) == &1 {
                print!("##");
            } else {
                print!("  ");
            }
        }
        println!("");
    }
}


fn part_one(program: &[isize]) -> usize {
    let mut panels = HashMap::new();
    run_robot(program, &mut panels);
    panels.len()
}


fn part_two(program: &[isize]) {
    let mut panels = HashMap::new();
    panels.insert((0,0), 1);
    run_robot(program, &mut panels);
    render(&panels);
}


fn main() {
    let input = std::fs::read_to_string("./input.txt")
        .expect("can't read input.txt");

    let program = intcode::parse(input.trim_end())
        .expect("can't parse input file");

    println!("Part one: {}", part_one(&program));
    println!("Part two:");
    part_two(&program);
}