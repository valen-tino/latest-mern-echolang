export async function submitProductFeedback(
  videoId: string,
  title: string,
  data: FeedbackFormData
) {
  // Mock API implementation
  return {
    id: Date.now().toString(),
    videoId,
    title,
    ...data,
    createdAt: new Date().toISOString(),
  };
}
