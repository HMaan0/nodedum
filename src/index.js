import { PrismaClient } from "@prisma/client";
import express from "express";

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

app.post("/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const { name, role, age } = req.body;

    const newUser = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (newUser) {
      res.send({ "Error email existed": email });
    } else {
      const newUser = await prisma.user.create({
        data: {
          email,
          name,
          role,
          age,
        },
      });
      res.send({ "User created": newUser });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get("/:email", async (req, res) => {
  console.log("HELLO SIR IF CAN SEE THIS YOU'll BE PRETTY HAPPY");
  try {
    const email = req.params.email;
    const newUser = await prisma.user.findFirst({
      where: {
        email,
      },
      select: {
        email: true,
        name: true,
        age: true,
        role: true,
      },
    });

    if (newUser) {
      res.send(newUser);
    } else {
      res.send({ "no user found with email": email });
    }
  } catch (error) {
    res.send(error);
  }
});

app.put("/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const { name, role, age } = req.body;

    const existUser = await prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (existUser) {
      const editedUser = await prisma.user.update({
        data: {
          email,
          name,
          age,
          role,
        },
      });
      res.send({ "User info updated": editedUser });
    } else {
      res.send({ "no user found with email": email });
    }
  } catch (error) {
    res.send(error);
  }
});

app.delete("/:email", async (req, res) => {
  try {
    const email = req.params.email;

    const newUser = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (newUser) {
      const deletedUser = await prisma.user.delete({
        where: {
          email,
        },
      });
      res.send({ "deleted user": deletedUser });
    } else {
      res.send({ "no user found with email": email });
    }
    res.send("this is for error");
  } catch (error) {
    res.send(error);
  }
});

const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
