const fetchButton = document.getElementById("fetchButton");
const list = document.getElementById("list");

const fetchData = async (url, method, body) => {
  const response = await fetch(url, {
    method: method,
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  return data;
};

fetchButton.addEventListener("click", async (e) => {
  e.preventDefault();
  const { rows } = await fetchData(
    "http://localhost:3000/admin.html",
    "POST",
    {}
  );

  rows.forEach((row) => {
    const li = document.createElement("li");
    li.innerHTML = `${row.username} ${row.bmi}`;
    list.appendChild(li);
  });
});
