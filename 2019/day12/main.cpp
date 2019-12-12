#include <iostream>
#include <array>

uint64_t GCD(uint64_t a, uint64_t b)
{
    if (b == 0)
        return a;
 
    return GCD(b, a % b);
}
 
uint64_t LCM(uint64_t a, uint64_t b)
{
    return a * b / GCD(a, b);
}
 
void simulateStep(std::array<int64_t, 4>& pos, std::array<int64_t, 4>& vel)
{
    for (int i = 0; i < 3; i++)
    {
        for (int j = i + 1; j < 4; j++)
        {
            if (pos[i] == pos[j])
                continue;
 
            if (pos[i] < pos[j])
            {
                vel[i]++;
                vel[j]--;
            }
            else
            {
                vel[i]--;
                vel[j]++;
            }
        }
    }
 
    for (int i = 0; i < 4; i++)
        pos[i] += vel[i];
}
 
void part1()
{
    std::array<int64_t, 4> posX = { 3, 10, -3, -8 };
    std::array<int64_t, 4> posY = { -6, 7, -7, 0 };
    std::array<int64_t, 4> posZ = { 6, -9, 9, 4 };
 
    std::array<int64_t, 4> velX = {};
    std::array<int64_t, 4> velY = {};
    std::array<int64_t, 4> velZ = {};
 
    for (int i = 0; i < 1000; i++)
        simulateStep(posX, velX);
 
    for (int i = 0; i < 1000; i++)
        simulateStep(posY, velY);
 
    for (int i = 0; i < 1000; i++)
        simulateStep(posZ, velZ);
 
    int64_t sum = 0;
    for (int i = 0; i < 4; i++)
        sum += (abs(posX[i]) + abs(posY[i]) + abs(posZ[i])) * (abs(velX[i]) + abs(velY[i]) + abs(velZ[i]));
 
    std::cout << sum << std::endl;
}
 
void part2()
{
    const std::array<int64_t, 4> initPosX = { 3, 10, -3, -8 };
    const std::array<int64_t, 4> initPosY = { -6, 7, -7, 0 };
    const std::array<int64_t, 4> initPosZ = { 6, -9, 9, 4 };
    const std::array<int64_t, 4> initVel = {};
 
    std::array<int64_t, 4> posX = initPosX;
    std::array<int64_t, 4> posY = initPosY;
    std::array<int64_t, 4> posZ = initPosZ;
 
    std::array<int64_t, 4> velX = {};
    std::array<int64_t, 4> velY = {};
    std::array<int64_t, 4> velZ = {};
 
    int64_t repeatX = -1;
    int64_t repeatY = -1;
    int64_t repeatZ = -1;
 
    for (int64_t i = 1;; i++)
    {
        simulateStep(posX, velX);
        if (velX == initVel && posX == initPosX)
        {
            repeatX = i;
            break;
        }
    }
 
    for (int64_t i = 1;; i++)
    {
        simulateStep(posY, velY);
        if (velY == initVel && posY == initPosY)
        {
            repeatY = i;
            break;
        }
    }
 
    for (int64_t i = 1;; i++)
    {
        simulateStep(posZ, velZ);
        if (velZ == initVel && posZ == initPosZ)
        {
            repeatZ = i;
            break;
        }
    }
 
    std::cout << LCM(LCM(repeatX, repeatY), repeatZ) << std::endl;
    return;
}

int main()
{
    part1();
    part2();
    return 0;
}