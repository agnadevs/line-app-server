import { v4 as uuidv4 } from 'uuid';
import fs from 'fs'

export default (userName: string) => {
  fs.readFile('dist/users.json', 'utf8', (err, data) => {
    if (err) throw err;
    console.log('File read ---- ', data);
  })
  const newUser = {
      userName,
      userId: uuidv4(),
      createdAt: new Date()
  }
  fs.appendFile('dist/users.json', JSON.stringify(newUser, null, 2), function (err) {
    if (err) throw err;
    console.log('Saved!');
  });

  return newUser;
}

// export default = {
//  createNewUser,
//  ...,
//}
