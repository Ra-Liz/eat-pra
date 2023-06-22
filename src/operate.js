function to() {
  window.open("https://github.com/Ra-Liz");
}

// 对话框查找菜谱
function dialog() {
  let msg = prompt("请输入菜名", "");
  if (msg !== null) {
    search(msg);
  }
}
// 查找菜谱
function search(msg) {
  fetch(`http://localhost:4444/eat?param=${msg}`)
    .then((response) => response.json())
    .then((data) => {
      if (data !== null) {
        const detailDiv = document.querySelector(".detail");
        detailDiv.innerHTML = `
                      <h1 name="title" class="title">${data.name}</h1>
                      <div name="msg" class="msg">${data.msg}</div>
                  `;
      } else {
        alert("暂时没有这道菜的做法，铁铁可以贡献菜谱哦~");
      }
    })
    .catch((error) => {
      console.log(error);
      alert("请求出错！");
    });
}

// 贡献菜谱
function add() {
  let name = prompt("请输入菜名", "");
  let msg = prompt("请输入做法步骤", "");
  if (name !== null && msg !== null) {
    fetch("http://localhost:4444/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, msg }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        alert("耶已添加成功，感谢贡献，祝您吃嘛嘛香！");
      })
      .catch((err) => {
        console.log(err);
        alert("添加出错啦");
      });
  }
}

// 删除菜谱
function remove() {
  let title = document.getElementsByName("title")[0].textContent;
  console.log(title);
  if (title !== "夏日下饭菜") {
    if (!confirm(`确定要删除 ${title} 吗？`)) return;

    fetch("http://localhost:4444/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        data ? alert(`删除成功!从此菜谱里缺少了‘${title}’`) : alert("删除失败");
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    alert("默认菜单删不了哦~");
    return;
  }
}

// 更改菜谱
function update() {
  let title = document.getElementsByName("title")[0].textContent;

  if (title !== "夏日下饭菜") {
    let name = prompt("请输入菜名", "");
    let msg = prompt("请输入做法步骤", "");

    if (name == "" || msg == "null") {
      alert("不能为空:P");
      return;
    }

    fetch("http://localhost:4444/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, name, msg }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data) {
          search(name)
          alert(`更新成功!船新版本:‘${name}’`)
        } else {
          alert("更新失败")
          return 
        }
      })
      .catch((error) => console.log(error));
  } else {
    alert("你不喜欢魔芋爽嘛？俺不同意你改:P");
    return;
  }
}
