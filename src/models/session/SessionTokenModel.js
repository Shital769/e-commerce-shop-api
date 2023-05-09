import SessionTokenSchema from "./SessionTokenSchema";

//create new session
export const createNewSession = (obj) => {
  return SessionTokenSchema(obj).save();
};

//delete sessions
export const deleteSession = (filter) => {
  return SessionTokenSchema.findOneAndDelete(filter);
};
