export default function authHeader() {
  const admin = JSON.parse(localStorage.getItem('admin'));

  if (admin && admin.accessToken) {
    // for Node.js Express back-end
    return { 'x-access-token': admin.accessToken };
  } else {
    return {};
  }
}