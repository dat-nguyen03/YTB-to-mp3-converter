window.addEventListener("load", function () {
  const loader = document.querySelector(".loader-container");
  const inputValue = document.querySelector("#url");
  const btnSubmit = document.querySelector("#btn-submit");
  const resultContainer = document.querySelector("#resultContainer");
  const videoTitle = document.querySelector("#videoTitle");
  const downloadLink = document.querySelector("#downloadLink");
  const size = document.querySelector("#size");
  const loaderText = document.querySelector(".loader-text");
  const regex = new RegExp(
    "^(https?://)?((www|music)\\.)?(youtube|youtu|youtube-nocookie)\\.(com|be)/"
  );

  btnSubmit.addEventListener("click", async function () {
    if (inputValue.value === "") {
      errorHandle("Vui lòng nhập URL!").then(() => {
        inputValue.focus();
      });
      return;
    }
    if (!regex.test(inputValue.value)) {
      errorHandle("Vui lòng nhập đúng URL!").then(() => {
        inputValue.focus();
      });
      return;
    }
    let parts = "";
    let videoId = "";
    if (inputValue.value.includes(".be/")) {
      parts = inputValue.value.split("/");
      videoId = parts[parts.length - 1].split("?")[0];
    } else {
      parts = inputValue.value.split(/[=&]/);
      videoId = parts[1];
    }

    mp3Conversion(videoId);
  });

  const mp3Conversion = async (id) => {
    try {
      loader.classList.remove("hidden");

      // let response = await fetch(
      //   `https://proxy-nodejs-api.vercel.app/api/init?id=${id}`
      // ).then((response) => response.json());

      // console.log(response);
      // if (response.status === "error") {
      //   errorHandle(response.message).then(() => {
      //     loader.classList.add("hidden");
      //   });
      //   return;
      // }

      let url = `https://youtube-mp36.p.rapidapi.com/dl?id=${id}`;
      const options = {
        method: "GET",
        headers: {
          async: true,
          crossDomain: true,
          "X-RapidAPI-Key":
            "9760a4eb7cmshd896bf44e044861p117162jsnf7d28979cc12",
          "X-RapidAPI-Host": "youtube-mp36.p.rapidapi.com",
        },
      };
      let res = await fetch(url, options).then((response) => response.json());
      if (res.status == "processing") {
        this.setTimeout(async () => {
          loaderText.textContent = `Đang chuyển đổi video sang mp3... ${res.progress}%`;
          mp3Conversion(id);
        }, 1000);
      }

      if (res.status === "fail") {
        errorHandle("Có lỗi xảy ra. Vui lòng thử lại!").then(() => {
          loader.classList.add("hidden");
        });
        return;
      }
      resultContainer.classList.remove("hidden");
      videoTitle.textContent = res.title;
      downloadLink.href = res.link;
      // size.textContent = res.size;
      inputValue.value = "";

      loader.classList.add("hidden");
      successHandle("Đã sẵn sàng để tải xuống!");
      // }
    } catch (error) {
      console.log(error);
      errorHandle("Có lỗi xảy ra. Vui lòng thử lại!").then(() => {
        loader.classList.add("hidden");
      });
    }
  };

  const errorHandle = (error) => {
    return Swal.fire({
      icon: "error",
      title: error,
    });
  };
  const successHandle = (message) => {
    return Swal.fire({
      icon: "success",
      title: message,
    });
  };
});
