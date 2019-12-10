import { readFileSync } from "fs";

enum Status {
    RUNNING,
    HALTED,
    WAITING
}

class IntcodeComputer {

    program: number[];
    inputQueue: number[] = [];

    pc = 0;

    base = 0;

    status: Status = Status.RUNNING;

    constructor(program: number[]) {
        this.program = program;
    }

    enqueueInput(inputs: number[]) {
        this.inputQueue = this.inputQueue.concat(inputs);
    }

    readMemory(address: number) : number {
        return this.program[address] ? this.program[address] : 0
    }

    doTheProcess(): number[] {

        const resolveParams = (params: number[], writes: number[]): number[] => {      
            const strInstruction = this.program[this.pc].toString();
            const paddedinstruction = "0".repeat(params.length + 2 - strInstruction.length) + this.program[this.pc].toString();
            return params.map((arg, index) => {
                if (!(writes.includes(index))) {
                    switch (Number(paddedinstruction[paddedinstruction.length - 3 - index])) {
                        case(0):
                            return this.readMemory(arg)
                        case(1):
                            return arg;
                        case(2):
                            return this.readMemory(arg + this.base)
                        default:
                            throw Error(`EXCEPTION`)
                    } 
                } else {
                    switch (Number(paddedinstruction[paddedinstruction.length - 3 - index])) {
                        case(1):
                            throw Error(`EXCEPTION`)
                        case (0):
                            return arg;
                        case(2):
                            return arg + this.base;
                    }
                }
    
            })
        }

        const getInput = (): number => {
            return this.inputQueue.shift();
        }

        const output = (number: number): void => {
            outputs.push(number);
        }
    
        let opcode = 99;
        let outputs: number[] = [];

        if (this.status == Status.HALTED) {
            throw Error("halted computer");
        } else {
            this.status = Status.RUNNING;
        }

        while(this.status == Status.RUNNING) {
            let paramcount = 0;
            let writes: number[] = [];
            let callback: (params: number[]) => any;
            const oldPc = this.pc;
            opcode = this.program[this.pc] % 100

            switch(opcode) {
                case (1):
                    paramcount = 3;
                    writes = [2];
                    callback = (params: number[]) => this.program[params[2]] = params[1] + params[0];
                    break;

                case (2):
                    paramcount = 3;
                    writes = [2];
                    callback = (params: number[]) => this.program[params[2]] = params[1] * params[0];    
                    break;

                case (3):
                    paramcount = 1;
                    writes = [0];
                    callback = (params: number[]) => this.program[params[0]] = getInput();
                    break;

                case (4):
                    paramcount = 1;
                    this.status = Status.WAITING;
                    callback = (params: number[]) => {
                        output(params[0]);
                    };
                    break;

                case(5):
                    paramcount = 2;
                    callback = (params: number[]) => {
                        if (params[0] !== 0) {
                            this.pc = params[1]
                        }};
                    break;

                case(6):
                    paramcount = 2;
                    callback = (params: number[]) => {
                        if (params[0] == 0) {
                            this.pc = params[1]
                        }};
                    break;

                case(7):
                    paramcount = 3;
                    writes = [2];
                    callback = (params: number[]) => {
                        this.program[params[2]] =  params[0] < params[1] ? 1 : 0;
                    }
                    break;

                case(8):
                    paramcount = 3;
                    writes = [2];
                    callback = (params: number[]) => {
                        this.program[params[2]] =  params[0] == params[1] ? 1 : 0;
                    }
                    break;
                
                case (9):
                    paramcount = 1;
                    callback = (params: number[]) => { 
                        this.base += params[0];
                    }
                    break;

                case(99): 
                    this.status = Status.HALTED;
                    paramcount = 1;
                    callback = (params: number[]) => {}
                    break;

                default:
                    console.log(`Invalid intcode ${this.program[this.pc]}`);
                    this.status = Status.HALTED;
                    paramcount = 1;
                    callback = (params: number[]) => {}
                    break;
            }

            const resolvedParams = resolveParams(this.program.slice(this.pc + 1, this.pc + 1 + paramcount), writes);
            callback(resolvedParams);
            if (oldPc == this.pc) {
                this.pc += (1 + paramcount);
            }
        }

        return outputs;
    }

}

let content = readFileSync("input.txt", "utf8");
let lines = content.trim().split(',').map(line => Number(line));

function part1() {
    let computer = new IntcodeComputer(Array.from(lines));
    computer.enqueueInput([1])
    console.log(computer.doTheProcess());
}

function part2() {
    let computer = new IntcodeComputer(Array.from(lines));
    computer.enqueueInput([2])
    console.log(computer.doTheProcess());
}

part1();
part2();