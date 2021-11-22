const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/messenger');
  const userSchema = new mongoose.Schema({
      username: String
  });
  const UserModel = mongoose.model('user', userSchema);
  /*const user = new UserModel({username:'mahamadou'});
  console.log(user.username);
  const doc = await user.save();
  console.log(doc);*/
  const users = await UserModel.find()
  console.log(users)
}