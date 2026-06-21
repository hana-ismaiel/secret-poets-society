import api from "@/lib/api"

export function useComments() {
  async function getCommentsForPoem(poemId) {
    const response = await api.get(`/comments/${poemId}`)
    return response.data
  }

  async function createComment(poemId, content, parentId = null) {
    const response = await api.post(`/comments/${poemId}`, {
      content,
      parentId,
    })
    return response.data
  }

  async function editComment(commentId, content) {
    const response = await api.put(`/comments/${commentId}`, { content })
    return response.data
  }

  async function deleteComment(commentId) {
    const response = await api.delete(`/comments/${commentId}`)
    return response.data
  }

  return { getCommentsForPoem, createComment, editComment, deleteComment }
}