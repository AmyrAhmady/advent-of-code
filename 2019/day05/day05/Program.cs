using System;
using System.Collections.Generic;
using System.Linq;
using System.IO;

namespace day05
{
    class Program
    {
        enum Opcode
        {
            Add = 1,
            Mul = 2,
            In = 3,
            Out = 4,
            Jnz = 5,
            Jz = 6,
            Lt = 7,
            Eq = 8,
            Hlt = 99,
        }

        static void Main(string[] args)
        {
            string input = File.ReadAllText("../../../input.txt");
            var answers = Solve(input);
            Console.WriteLine("Part1 answer: " + answers.ToList()[0].ToString());
            Console.WriteLine("Part2 answer: " + answers.ToList()[1].ToString());
            Console.Read();
        }

        static IEnumerable<object> Solve(string input)
        {
            yield return Part1(input);
            yield return Part2(input);
        }

        static int Part1(string input)
        {
            return DoTheProcess(input, 1).Last();
        }

        static int Part2(string input)
        {
            return DoTheProcess(input, 5).Last();
        }

        static IEnumerable<int> DoTheProcess(string st, int input)
        {
            var memory = st.Split(',').Select(int.Parse).ToArray();
            var ip = 0;

            while (true)
            {
                Opcode opcode = (Opcode)(memory[ip] % 100);
                Func<int, int> arg = (int i) =>
                    (memory[ip] / (int)Math.Pow(10, i + 1) % 10) == 0 ?
                        memory[memory[ip + i]] :
                        memory[ip + i];

                switch (opcode)
                {
                    case Opcode.Add: memory[memory[ip + 3]] = arg(1) + arg(2); ip += 4; break;
                    case Opcode.Mul: memory[memory[ip + 3]] = arg(1) * arg(2); ip += 4; break;
                    case Opcode.In: memory[memory[ip + 1]] = input; ip += 2; break;
                    case Opcode.Out: yield return arg(1); ip += 2; break;
                    case Opcode.Jnz: ip = arg(1) != 0 ? arg(2) : ip + 3; break;
                    case Opcode.Jz: ip = arg(1) == 0 ? arg(2) : ip + 3; break;
                    case Opcode.Lt: memory[memory[ip + 3]] = arg(1) < arg(2) ? 1 : 0; ip += 4; break;
                    case Opcode.Eq: memory[memory[ip + 3]] = arg(1) == arg(2) ? 1 : 0; ip += 4; break;
                    case Opcode.Hlt: yield break;
                    default: break;
                }
            }
        }
    }
}
