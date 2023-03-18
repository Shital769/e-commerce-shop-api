import UserSchema from "./UserSchema.js";

export const createNewUser = (obj) => {
  return UserSchema(obj).save();
};

//@filter and @obj must be an object
//@filter is the search criteria
//@obj is the conetent which will be updated in the DB

export const updateUser = (filter, obj) => {
  return UserSchema.findOneAndUpdate(filter, obj, { new: true });
};

//find a user, @filter must be an object
export const findUser = (filter) => {
  return UserSchema.findOne(filter);
};
