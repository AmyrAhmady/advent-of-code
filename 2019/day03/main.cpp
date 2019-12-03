#include <iostream>
#include <fstream>
#include <map>
#include <vector>
#include <sstream>

struct Vector2
{
    int x;
    int y;

    bool const operator!=(const Vector2 &o) const
    {
        return x != o.x || x != o.y;
    }

    bool const operator<(const Vector2 &o) const
    {
        return x < o.x || (x == o.x && y < o.y);
    }
};

std::vector<std::string> split(const std::string &s, char delimiter)
{
    std::vector<std::string> tokens;
    std::string token;
    std::istringstream tokenStream(s);
    while (std::getline(tokenStream, token, delimiter))
    {
        tokens.push_back(token);
    }
    return tokens;
}

std::map<Vector2, int> ParseWire(const std::vector<std::string> &steps)
{
    std::map<Vector2, int> result = {};
    Vector2 temp = {0, 0};
    int x = 0, y = 0, c = 0;
    for (const auto &i : steps)
    {
        switch (i[0])
        {

        case 'U':
            for (int step = 0; step < std::stoi(i.substr(1)); step++)
            {
                temp = {x, ++y};
                result[temp] = c++;
            }
            break;
        case 'D':
            for (int step = 0; step < std::stoi(i.substr(1)); step++)
            {
                temp = {x, --y};
                result[temp] = c++;
            }
            break;
        case 'R':
            for (int step = 0; step < std::stoi(i.substr(1)); step++)
            {
                temp = {++x, y};
                result[temp] = c++;
            }
            break;
        case 'L':
            for (int step = 0; step < std::stoi(i.substr(1)); step++)
            {
                temp = {--x, y};
                result[temp] = c++;
            }
            break;
        }
    }
    return result;
}

int GetStepSum(const std::map<Vector2, int> &wireA, const std::map<Vector2, int> &wireB)
{
    int sum = INT_MAX;
    for (const auto &[vector, steps] : wireA)
    {
        if (vector != Vector2({0, 0}) && wireB.find(vector) != wireB.end())
        {
            int step_sum = steps + wireB.find(vector)->second;
            if (step_sum < sum)
                sum = step_sum;
        }
    }
    return sum;
}

int GetDistance(const std::map<Vector2, int> &wireA, const std::map<Vector2, int> &wireB)
{
    int dist = INT_MAX;
    for (const auto &[vector, steps] : wireA)
    {
        if (vector != Vector2({0, 0}) && wireB.find(vector) != wireB.end())
        {
            int distance = std::abs(vector.x) + std::abs(vector.y);
            if (distance < dist)
                dist = distance;
        }
    }
    return dist;
}

int main()
{
    std::map<Vector2, int> wireA, wireB;
    std::ifstream input("input.txt");
    if (input.is_open())
    {
        std::string line;
        char i = 0;
        while (std::getline(input, line))
        {
            if (!i)
                wireA = ParseWire(split(line, ','));
            else
                wireB = ParseWire(split(line, ','));
            i++;
        }
        input.close();
    }

    std::cout << "Part1 answer: " << GetDistance(wireA, wireB) << std::endl;
    std::cout << "Part2 answer: " << GetStepSum(wireA, wireB) + 2;
    return 0;
}