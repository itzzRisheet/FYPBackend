import bcrypt from "bcrypt";

bcrypt.hash("Aum@1234", 12).then((ps) => {
  console.log(ps);
});
