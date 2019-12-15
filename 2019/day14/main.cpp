#include <deque>
#include <fstream>
#include <iostream>
#include <map>
#include <set>
#include <sstream>
#include <string>
#include <vector>

using Number = unsigned long long;

struct Ingredient
{
    int requiredAmount;
    std::string ingredientName;
};

struct Reaction
{
    int makes;
    std::vector<Ingredient> ingredients;
};

void TopoHelper(const std::string &name, const std::map<std::string, Reaction> &reactions, std::set<std::string> &visited, std::deque<std::string> &order)
{
    if (name == "ORE")
        return;
    visited.insert(name);
    const auto &[howmuch, ingredients] = reactions.at(name);
    for (const auto &[used, ingredientName] : ingredients)
        if (!visited.count(ingredientName))
            TopoHelper(ingredientName, reactions, visited, order);
    order.push_front(name);
}

std::deque<std::string> TopoSort(const std::string &name, const std::map<std::string, Reaction> &reactions)
{
    std::set<std::string> visited;
    std::deque<std::string> order;
    TopoHelper(name, reactions, visited, order);
    return order;
}

std::map<std::string, Reaction> readInput(std::istream &ifile)
{
    std::map<std::string, Reaction> reactions;
    std::string line;
    while (getline(ifile, line))
    {
        Ingredient i;
        std::vector<Ingredient> ingredients;
        std::istringstream iline(line);
        bool done = false;
        while (!done)
        {
            iline >> i.requiredAmount >> i.ingredientName;
            if (i.ingredientName.back() == ',')
                i.ingredientName.pop_back();
            else
                done = true;
            ingredients.push_back(i);
        }
        std::string arrow;
        iline >> arrow >> i.requiredAmount >> i.ingredientName;
        reactions[i.ingredientName] = {i.requiredAmount, ingredients};
    }
    return reactions;
}

int main()
{
    std::ifstream ifile("./input.txt");

    auto reactions = readInput(ifile);

    auto divisionRoundUp = [](Number num, Number den) {
        return (num + den - 1) / den;
    };

    auto chemicalsInOrder = TopoSort("FUEL", reactions);

    auto getNeededOreCount = [&](Number fuel) {
        std::map<std::string, Number> amountNeeded{{"FUEL", fuel}};
        for (const auto &chemical : chemicalsInOrder)
        {
            const auto &[amountReactionMakes, ingredients] = reactions[chemical];
            for (const auto &[reactionRequires, name] : ingredients)
            {
                auto timesToRunReaction =
                    divisionRoundUp(amountNeeded[chemical], amountReactionMakes);
                amountNeeded[name] += reactionRequires * timesToRunReaction;
            }
        }
        return amountNeeded["ORE"];
    };

    std::cout << "Part1 answer: " << getNeededOreCount(1) << "\n";
    auto lower = 0ull;
    auto upper = 1000000000000ull;
    while (lower != upper)
    {
        auto mid = lower + (upper - lower) / 2;

        if (getNeededOreCount(mid) <= 1000000000000ull)
            lower = mid + 1;
        else
            upper = mid;
    }

    std::cout << "Part2 answer: " << lower - 1 << "\n";

    return 0;
}