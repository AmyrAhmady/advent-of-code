use std::fs;
use std::str::FromStr;

struct Computer {
    inst_ptr:usize,
    running:bool,
    memory:Vec<usize>,
}

impl Computer {
    fn init(noun:usize, verb:usize, intcodes:&Vec<usize>) -> Computer {
        let mut c = Computer {
            inst_ptr: 0,
            running: false,
            memory: intcodes.clone(),
        };
        c.memory[1] = noun;
        c.memory[2] = verb;
        c
    }

    fn step(&mut self) {
        self.inst_ptr = self.inst_ptr + 4;
    }

    fn halt(&mut self) {
        self.running = false;
    }

    fn result (& self) -> usize {
        self.memory[0]
    }

    fn run(&mut self) {
        self.running = true;
        while self.running {
            let op = self.memory[self.inst_ptr];
            match op {
                1 => {
                    let addr1 = self.memory[self.inst_ptr + 1];
                    let addr2 = self.memory[self.inst_ptr + 2];
                    let addr3 = self.memory[self.inst_ptr + 3];

                    let i1 = self.memory[addr1];
                    let i2 = self.memory[addr2];

                    self.memory[addr3] = i1 + i2;
                    self.step();
                },
                2 => {
                    let addr1 = self.memory[self.inst_ptr + 1];
                    let addr2 = self.memory[self.inst_ptr + 2];
                    let addr3 = self.memory[self.inst_ptr + 3];

                    let i1 = self.memory[addr1];
                    let i2 = self.memory[addr2];
                    
                    self.memory[addr3] = i1 * i2;
                    self.step();
                },
                99 => { self.halt(); },
                _ => { },
            }
        }
    }
}

fn main() {
    let filename = "input.txt";
    let contents = fs::read_to_string(filename)
        .expect(
            format!("Could not read the file from {}", filename)
            .as_str()
        );

    let intcodes:Vec<usize> = contents.split(',')
        .map( 
            |num| usize::from_str(num).expect("Could not split")
        )
        .collect();

    part1(&intcodes);
    part2(&intcodes);
}

fn part1(intcodes:&Vec<usize>) {
    let noun = 12;
    let verb = 2;
    let mut computer = Computer::init(noun, verb, intcodes);
    computer.run();
    println!("Part1 answer: {}", computer.result());
}

fn part2(intcodes:&Vec<usize>) {
    for noun in 0..99 {
        for verb in 0..99 {
            let mut computer = Computer::init(noun, verb, intcodes);
            computer.run();

            if computer.result() == 19690720 {
                println!("Part2 answer: {}", noun * 100 + verb);
            }
        }
    }
}