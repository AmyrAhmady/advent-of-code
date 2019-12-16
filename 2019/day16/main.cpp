#include <iostream>
#include <fstream>
#include <vector>
#include <string>
#include <time.h>

void readInput(std::fstream &in, std::vector<int> &sequence)
{
    std::string number;

    in >> number;
    for (int i = 0; i < number.size(); i++)
    {
        sequence.push_back(number[i] - '0');
    }
}

void FFTAlgo(std::vector<int> &sequence, const std::vector<int> &basePattern)
{
    std::vector<int> newSequence(sequence.size());
    std::vector<int> pattern;
    int it = 1, sum = 0, phase = 0;

    while (phase < 100)
    {
        for (int digit = 0; digit < sequence.size(); digit++)
        {
            pattern.clear();
            for (int i = 0; i < basePattern.size(); i++)
            {
                for (int j = 0; j <= digit; j++)
                {
                    pattern.push_back(basePattern[i]);
                }
            }

            sum = 0;
            for (int currDigit = digit; currDigit < sequence.size(); currDigit++)
            {
                it = (currDigit + 1) % pattern.size();
                sum += sequence[currDigit] * pattern[it++];
            }
            newSequence[digit] = abs(sum) % 10;
        }
        sequence = newSequence;
        phase++;
    }
}

void calcSecondHalfOfInput(std::vector<int> &sequence)
{
    std::vector<int> newSequence(sequence.size());
    int seqSize = sequence.size();
    int sum = 0;
    int phase = 0;

    while (phase < 100)
    {
        sum = 0;
        for (int it = seqSize - 1; it >= seqSize / 2; it--)
        {
            sum += sequence[it];
            newSequence[it] = sum % 10;
        }
        sequence = newSequence;
        phase++;
    }
}

std::string part1(const std::vector<int> &seq, const std::vector<int> &basePattern)
{
    std::vector<int> sequence = seq;
    std::string answer;
    FFTAlgo(sequence, basePattern);
    for (int it = 0; it < 8; it++)
    {
        answer += std::to_string(sequence[it]);
    }
    return answer;
}

std::string part2(const std::vector<int> &seq)
{
    std::string answer;
    std::vector<int> sequence = seq;
    int msgOffset = 0;
    int seqSize = sequence.size();
    for (int i = 1; i < 10000; i++)
    {
        for (int j = 0; j < seqSize; j++)
        {
            sequence.push_back(sequence[j]);
        }
    }

    for (int i = 0; i < 7; i++)
    {
        msgOffset = msgOffset * 10 + sequence[i];
    }

    calcSecondHalfOfInput(sequence);

    for (int it = msgOffset; it < msgOffset + 8; it++)
    {
        answer += std::to_string(sequence[it]);
    }
    return answer;
}

int main()
{
    std::fstream input("input.txt", std::fstream::in);
    std::vector<int> basePattern{0, 1, 0, -1};
    std::vector<int> sequence;

    readInput(input, sequence);
    clock_t start = clock();
    std::cout << "Part1 answer: " << part1(sequence, basePattern) << std::endl;
    std::cout << "Part2 answer: " << part2(sequence);
    printf("\nTime taken: %.2fs\n", (double)(clock() - start)/CLOCKS_PER_SEC);
    input.close();
}