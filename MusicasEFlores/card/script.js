$(document).ready(function () {
  $(".container")
    .mouseenter(function () {
      $(".card").addClass("up")
    })
    .mouseleave(function () {
      $(".card").removeClass("up")
    })
})
