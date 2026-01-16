import * as NoSQL from '../nosql/database';
const getUsers = async () => {
  return await NoSQL.getCollection('users');
};
const saveUsers = async (users) => {
  for (const user of users) {
    await NoSQL.updateDocument('users', user.id, user);
  }
};
const getAppointments = async () => {
  return await NoSQL.getCollection('appointments');
};
const saveAppointments = async (appointments) => {
  for (const appointment of appointments) {
    await NoSQL.updateDocument('appointments', appointment.id, appointment);
  }
};
const getServices = async () => {
  return await NoSQL.getCollection('services');
};
const registerUser = async (name, email, password) => {
  const users = await getUsers();
  if (users.find(u => u.email === email)) return null;
  const newUser = { id: Date.now(), name, email, password };
  users.push(newUser);
  await saveUsers(users);
  return newUser;
};
const loginUser = async (email, password) => {
  const users = await getUsers();
  return users.find(u => u.email === email && u.password === password) || null;
};
const editUser = async (updatedUser) => {
  const users = await getUsers();
  const idx = users.findIndex(u => u.id === updatedUser.id);
  if (idx === -1) return null;
  users[idx] = updatedUser;
  await saveUsers(users);
  return updatedUser;
};
const addAppointment = async (appointment) => {
  const appointments = await getAppointments();
  const newAppointment = { ...appointment, id: Date.now(), status: 'Pending' };
  appointments.push(newAppointment);
  await saveAppointments(appointments);
  return newAppointment;
};

const getUserAppointments = async (userId) => {
  const appointments = await getAppointments();
  return appointments.filter(a => a.userId === userId);
};


const updateAppointment = async (id, updatedFields) => {
  const appointments = await getAppointments();
  const idx = appointments.findIndex(a => a.id === id);
  if (idx === -1) return null;
  appointments[idx] = { ...appointments[idx], ...updatedFields };
  await saveAppointments(appointments);
  return appointments[idx];
};

const deleteAppointment = async (id) => {
  await NoSQL.deleteDocument('appointments', id);
  return true;
};

const updateAppointmentStatus = async (id, status) => {
  return updateAppointment(id, { status });
};

export default {
  getUsers,
  saveUsers,
  getAppointments,
  saveAppointments,
  getServices,
  registerUser,
  loginUser,
  editUser,
  addAppointment,
  getUserAppointments,
  updateAppointmentStatus,
  updateAppointment,
  deleteAppointment,
};
