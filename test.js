async function f() {
  let pro = new Promise((resolve, reject) => {
    setTimeout(() => resolve("done", 2000));
  });
  let msg = await pro;
  return msg;
}
f().then((r) => {
  console.log(r);
});
