const queryParams = new URLSearchParams({
  q: "",
  per_page: 10,
});

console.log("query string", queryParams.toString());

const form = document.getElementById("form");
const search_bar = document.getElementById("search_bar");
const searchingResults = document.querySelector(".searching_results");

function createBlockWithResult(inner) {
  const result = document.createElement("div");
  result.classList = "result";
  searchingResults.appendChild(result);

  result.innerHTML = inner;
}

form.addEventListener("submit", function (e) {
  e.preventDefault();
  console.log("botton");
  queryParams.set("q", `${search_bar.value} in:name`);

  searchingResults.innerHTML = "";

  const octokit = new Octokit({
    auth: "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",
  });

  fetch(
    `https://api.github.com/search/repositories?${queryParams.toString()}`,
    {
      headers: {
        Accept: "application/vnd.github+json",
      },
    }
  )
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        throw new Error("Введен неправильный запрос");
      }
    })
    .then((body) => {
      if (body.total_count === 0) {
        createBlockWithResult(`<div>Нет результатов</div>`);
      }
      body.items.forEach((item, index) => {
        console.log(item);

        createBlockWithResult(`<span class='index'>${
          index + 1
        }</span> <img class="avatar" src="${
          item.owner.avatar_url
        }"></img><span class="rep_name"><strong>Repository:  </strong> </span>
        <a target="_blank" href="${item.html_url}">${item.name}</a>
        <span class="avtor_name"><strong>Owner: </strong> ${
          item.owner.login
        }</span>
      `);
      });
    })
    .catch((error) => {
      createBlockWithResult(`<div>${error?.message}</div>`);
    });
});
