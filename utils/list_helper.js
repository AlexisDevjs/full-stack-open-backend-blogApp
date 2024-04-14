function dummy(blogs) {
  return 1
}

function totalLikes(blogs) {
  return blogs.reduce((acc, blog) => acc + blog.likes, 0)
}

function favoriteBlog(blogs) {
  return blogs.reduce((maxLikeBlog, currentBlog) => {
    return currentBlog.likes > maxLikeBlog.likes ? currentBlog : maxLikeBlog
  }, blogs[0])
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
}
