//let input_canvas = document.getElementById("input_canvas")
//let text_canvas = document.getElementById("text_canvas")
//let output_canvas = document.getElementById("output_canvas")

function input_image() {
    let cover_img = document.getElementById("cover_img")
    if (cover_img.files && cover_img.files[0]) {
        cover_img = cover_img.files[0]
        let input_canvas = document.getElementById("input_canvas")
        let in_context = input_canvas.getContext("2d", {alpha: false})
        let img = document.createElement("img")
        let reader = new FileReader()
        reader.onload = function() {
            img.src = reader.result
            // delay needed for loading correct image
            setTimeout(function() {
                input_canvas.width = img.width
                input_canvas.height = img.height
                if (document.getElementById("input_text")) {
                    text_to_image()
                }
                else {
                    decrypt()
                }
                in_context.drawImage(img,0,0)
            },1)
        }
        reader.readAsDataURL(cover_img)
    }
}

function text_to_image() {
    let input_canvas = document.getElementById("input_canvas")
    let text_canvas = document.getElementById("text_canvas")
    let text_canvas_context = text_canvas.getContext("2d", {alpha: false})
    text_canvas.width = input_canvas.width
    text_canvas.height = input_canvas.height
    let input_text = document.getElementById("input_text").value
    let input_size = document.getElementById("input_size").value
    let input_fcolor = document.getElementById("input_fcolor").value
    let input_bcolor = document.getElementById("input_bcolor").value
    text_canvas_context.fillStyle = input_bcolor
    text_canvas_context.fillRect(0, 0, text_canvas.width, text_canvas.height)
    text_canvas_context.fillStyle = input_fcolor
    text_canvas_context.font = `${input_size}px arial, sans-serif`
    // by default, fillText() squishes all text into one line
    input_text = input_text.split(/\n/)
    let counter = 1
    for (let line of input_text) {
        text_canvas_context.fillText(line, 0, input_size*(counter), text_canvas.width)
        // to do: wordwrap
        counter += 1
    }
    encrypt()
}

function encrypt() {
    let input_canvas = document.getElementById("input_canvas"),
        in_context = input_canvas.getContext("2d", {alpha: false})
    let text_canvas = document.getElementById("text_canvas"),
        text_canvas_context = text_canvas.getContext("2d", {alpha: false})
    let output_canvas = document.getElementById("output_canvas"),
        output_canvas_context = output_canvas.getContext("2d", {alpha: false})
    output_canvas.width = input_canvas.width
    output_canvas.height = input_canvas.height
    let high = in_context.getImageData(0, 0, input_canvas.width, input_canvas.height)
    let low = text_canvas_context.getImageData(0, 0, text_canvas.width, text_canvas.height)
    for (let i = 0; i < high.data.length; i += 1) {
        high.data[i] = ((high.data[i] >> 4) << 4) | (low.data[i] >> 4)
    }
    output_canvas_context.putImageData(high, 0, 0)
    let download = document.getElementById("download")
    download.href = output_canvas.toDataURL('image/png')
    download.style = "display: block;"
}

function decrypt() {
    let input_canvas = document.getElementById("input_canvas"),
        in_context = input_canvas.getContext("2d", {alpha: false})
    let output_canvas = document.getElementById("output_canvas"),
        output_canvas_context = output_canvas.getContext("2d", {alpha: false})
    output_canvas.width = input_canvas.width
    output_canvas.height = input_canvas.height
    let imgdata = in_context.getImageData(0, 0, input_canvas.width, input_canvas.height)
    for (let i = 0; i < imgdata.data.length; i += 1) {
        imgdata.data[i] = imgdata.data[i] << 4 & 240
    }
    output_canvas_context.putImageData(imgdata, 0, 0)
    let download = document.getElementById("download")
    download.href = output_canvas.toDataURL('image/png')
    download.style = "display: block;"
}