import math
from turtle import *

def hearta(k):
    return 15 * math.sin(k) ** 3

def heartb(k):
    return 12 * math.cos(k) - 5 * math.cos(2 * k) - 2 * math.cos(3 * k) - math.cos(4 * k)

speed(0)  # Set to maximum speed
bgcolor("black")

penup()  # Prevent drawing while moving to the starting position
goto(0, 0)  # Move turtle to starting point
pendown()  # Start drawing

for i in range(6000):
    goto(hearta(i / 100) * 20, heartb(i / 100) * 20)  # Scaling down the loop value for smoother curves
    color("#f73487")  # Set color inside the loop

done()