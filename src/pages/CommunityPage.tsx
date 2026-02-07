import { useState, useRef } from 'react';
import { useStore } from '../store/useStore';
import { IconHeart, IconHeartFilled, IconChat, IconSend, IconImage, IconTrash, IconEdit, IconFlag, IconX, IconPin, IconReply, IconCamera, IconCheck } from '../components/Icons';

export function CommunityPage() {
  const { user, posts, addPost, updatePost, deletePost, likePost, addComment, updateComment, deleteComment, reportPost, pinPost, unpinPost } = useStore();
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostImage, setNewPostImage] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  const [commentTexts, setCommentTexts] = useState<Record<string, string>>({});
  const [editingPost, setEditingPost] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [editImage, setEditImage] = useState('');
  const [showComments, setShowComments] = useState<Record<string, boolean>>({});
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const [reportingPost, setReportingPost] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState('');
  const [editingComment, setEditingComment] = useState<{postId: string; commentId: string} | null>(null);
  const [editCommentContent, setEditCommentContent] = useState('');
  const [replyingTo, setReplyingTo] = useState<{postId: string; commentId: string; userName: string} | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const postFileRef = useRef<HTMLInputElement>(null);

  const handleAddPost = () => {
    if (!newPostContent.trim()) return;
    addPost(newPostContent.trim(), newPostImage.trim() || undefined);
    setNewPostContent('');
    setNewPostImage('');
    setShowImageInput(false);
  };

  const handleEdit = (postId: string) => {
    updatePost(postId, editContent, editImage || undefined);
    setEditingPost(null);
    setEditContent('');
    setEditImage('');
  };

  const handleAddComment = (postId: string) => {
    const text = commentTexts[postId];
    if (!text?.trim()) return;
    const parentId = replyingTo?.postId === postId ? replyingTo.commentId : undefined;
    const content = replyingTo?.postId === postId ? `@${replyingTo.userName} ${text.trim()}` : text.trim();
    addComment(postId, content, parentId);
    setCommentTexts(t => ({ ...t, [postId]: '' }));
    setReplyingTo(null);
  };

  const handleReport = (postId: string) => {
    if (!reportReason.trim()) return;
    reportPost(postId, reportReason.trim());
    setReportingPost(null);
    setReportReason('');
  };

  const handleEditComment = () => {
    if (!editingComment || !editCommentContent.trim()) return;
    updateComment(editingComment.postId, editingComment.commentId, editCommentContent.trim());
    setEditingComment(null);
    setEditCommentContent('');
  };

  const handlePostFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setNewPostImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleEditFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setEditImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const isAdmin = user?.email === 'admin@patente.com';

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'الآن';
    if (mins < 60) return `منذ ${mins} د`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `منذ ${hours} س`;
    const days = Math.floor(hours / 24);
    return `منذ ${days} يوم`;
  };

  const sortedPosts = [...posts].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="px-5 space-y-4 animate-fade-in">
      <p className="text-sm text-text-secondary font-medium flex items-center gap-2">
        <IconChat size={16} /> تواصل مع متعلمين آخرين وشارك تجربتك
      </p>

      {/* Expanded Image Modal */}
      {expandedImage && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4" onClick={() => setExpandedImage(null)}>
          <div className="relative max-w-lg w-full">
            <img src={expandedImage} alt="صورة مكبرة" className="w-full rounded-2xl" />
            <button onClick={() => setExpandedImage(null)}
              className="absolute top-3 left-3 w-9 h-9 bg-black/50 text-white rounded-full flex items-center justify-center">
              <IconX size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {reportingPost && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4" onClick={() => setReportingPost(null)}>
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm space-y-4 animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-text flex items-center gap-2">
                <IconFlag size={18} className="text-danger" /> إبلاغ عن المنشور
              </h3>
              <button onClick={() => setReportingPost(null)} className="text-text-muted"><IconX size={18} /></button>
            </div>
            <textarea value={reportReason} onChange={e => setReportReason(e.target.value)}
              placeholder="اكتب سبب الإبلاغ..."
              className="w-full p-4 rounded-2xl border border-border-light focus:border-danger focus:outline-none text-sm bg-surface resize-none h-24" />
            <div className="flex gap-2">
              <button onClick={() => handleReport(reportingPost)}
                disabled={!reportReason.trim()}
                className="flex-1 bg-danger text-white py-3 rounded-2xl text-sm font-bold disabled:opacity-30 flex items-center justify-center gap-2">
                <IconFlag size={14} /> إرسال البلاغ
              </button>
              <button onClick={() => { setReportingPost(null); setReportReason(''); }}
                className="px-5 py-3 rounded-2xl text-sm font-bold bg-surface text-text-secondary border border-border-light">
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Post */}
      <div className="bg-white rounded-2xl border border-border-light p-5 shadow-card space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 gradient-primary rounded-2xl flex items-center justify-center text-sm font-bold text-white shadow-sm">
            {user?.name?.charAt(0)}
          </div>
          <span className="text-sm font-bold text-text">{user?.name}</span>
        </div>
        <textarea value={newPostContent} onChange={e => setNewPostContent(e.target.value)}
          placeholder="شارك سؤالك أو تجربتك مع المجتمع..."
          className="w-full p-4 rounded-2xl border border-border-light focus:border-primary focus:outline-none focus:ring-3 focus:ring-primary/10 text-sm bg-surface resize-none h-24 transition-all" />
        
        {showImageInput && (
          <div className="space-y-2">
            <div className="flex gap-2">
              <button onClick={() => postFileRef.current?.click()}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border border-border-light bg-surface text-text-secondary text-xs font-bold hover:bg-primary-50 hover:text-primary transition-all">
                <IconCamera size={14} /> من الجهاز
              </button>
              <input type="url" value={newPostImage} onChange={e => setNewPostImage(e.target.value)}
                placeholder="أو أدخل رابط الصورة..."
                className="flex-1 px-4 py-3 rounded-2xl border border-border-light focus:border-primary focus:outline-none text-xs bg-surface" dir="ltr" />
            </div>
            <input ref={postFileRef} type="file" accept="image/*" onChange={handlePostFileUpload} className="hidden" />
            {newPostImage && (
              <div className="relative">
                <img src={newPostImage} alt="preview" className="w-full h-40 object-cover rounded-2xl border border-border-light" />
                <button onClick={() => setNewPostImage('')}
                  className="absolute top-2 left-2 w-7 h-7 bg-danger text-white rounded-full flex items-center justify-center">
                  <IconX size={12} />
                </button>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center gap-2">
          <button onClick={handleAddPost}
            disabled={!newPostContent.trim()}
            className="gradient-primary text-white px-6 py-3 rounded-2xl text-xs font-bold transition-all disabled:opacity-30 shadow-primary-glow/40 active:scale-[0.97] flex items-center gap-2">
            <IconSend size={14} /> نشر
          </button>
          <button onClick={() => setShowImageInput(!showImageInput)}
            className={`px-4 py-3 rounded-2xl text-xs font-bold transition-all border flex items-center gap-2 ${showImageInput ? 'bg-primary-50 text-primary border-primary-100' : 'bg-surface text-text-secondary border-border-light'}`}>
            <IconImage size={14} /> صورة
          </button>
        </div>
      </div>

      {/* Posts */}
      <div className="space-y-3">
        {sortedPosts.map((post, i) => (
          <div key={post.id} className={`bg-white border-2 rounded-2xl overflow-hidden shadow-card animate-fade-in stagger-${(i % 5) + 1} ${post.pinned ? 'border-primary/30 bg-primary-50/30' : post.reported ? 'border-danger/20' : 'border-border-light'}`}>
            <div className="p-5 space-y-4">
              {/* Pinned Badge */}
              {post.pinned && (
                <div className="flex items-center gap-2 bg-primary-50 rounded-xl px-3 py-2 border border-primary-100">
                  <IconPin size={14} className="text-primary" />
                  <span className="text-[11px] font-bold text-primary">منشور مثبت</span>
                </div>
              )}

              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 gradient-primary rounded-2xl flex items-center justify-center text-xs font-bold text-white shadow-sm">
                    {post.userName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-text">{post.userName}</p>
                    <p className="text-[10px] text-text-muted font-medium">{timeAgo(post.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {isAdmin && (
                    <button onClick={() => post.pinned ? unpinPost(post.id) : pinPost(post.id)}
                      className={`p-2 rounded-xl transition-colors ${post.pinned ? 'text-primary bg-primary-50' : 'text-text-muted hover:bg-surface'}`}
                      title={post.pinned ? 'إلغاء التثبيت' : 'تثبيت'}>
                      <IconPin size={14} />
                    </button>
                  )}
                  {post.userId === user?.id && (
                    <button onClick={() => { setEditingPost(post.id); setEditContent(post.content); setEditImage(post.imageUrl || ''); }}
                      className="p-2 text-text-muted hover:bg-surface rounded-xl transition-colors">
                      <IconEdit size={14} />
                    </button>
                  )}
                  {(post.userId === user?.id || isAdmin) && (
                    <button onClick={() => deletePost(post.id)}
                      className="p-2 text-text-muted hover:bg-danger-light hover:text-danger rounded-xl transition-colors">
                      <IconTrash size={14} />
                    </button>
                  )}
                  {post.userId !== user?.id && !isAdmin && (
                    <button onClick={() => setReportingPost(post.id)}
                      className="p-2 text-text-muted hover:bg-pastel-orange hover:text-orange-600 rounded-xl transition-colors" title="إبلاغ">
                      <IconFlag size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* Content */}
              {editingPost === post.id ? (
                <div className="space-y-3">
                  <textarea value={editContent} onChange={e => setEditContent(e.target.value)}
                    className="w-full p-4 rounded-2xl border border-border-light focus:border-primary focus:outline-none text-sm bg-surface resize-none h-24" />
                  <div className="flex gap-2">
                    <button onClick={() => fileRef.current?.click()}
                      className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-surface text-text-secondary border border-border-light text-xs font-bold">
                      <IconCamera size={14} /> صورة
                    </button>
                    <input ref={fileRef} type="file" accept="image/*" onChange={handleEditFileUpload} className="hidden" />
                  </div>
                  {editImage && (
                    <div className="relative">
                      <img src={editImage} alt="preview" className="w-full h-32 object-cover rounded-2xl border border-border-light" />
                      <button onClick={() => setEditImage('')} className="absolute top-2 left-2 w-7 h-7 bg-danger text-white rounded-full flex items-center justify-center">
                        <IconX size={12} />
                      </button>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(post.id)}
                      className="gradient-primary text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm flex items-center gap-1">
                      <IconCheck size={14} /> حفظ
                    </button>
                    <button onClick={() => setEditingPost(null)}
                      className="bg-surface text-text-secondary px-5 py-2.5 rounded-xl text-xs font-bold border border-border-light">إلغاء</button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-[13px] text-text leading-8 whitespace-pre-wrap">{post.content}</p>
                  {post.imageUrl && (
                    <button onClick={() => setExpandedImage(post.imageUrl!)} className="w-full">
                      <img src={post.imageUrl} alt="صورة المنشور" className="w-full h-48 object-cover rounded-2xl border border-border-light hover:opacity-90 transition-opacity cursor-pointer" />
                    </button>
                  )}
                </>
              )}

              {post.reported && isAdmin && (
                <div className="bg-danger-light border-2 border-danger/10 rounded-xl px-4 py-2.5 space-y-1">
                  <p className="text-[11px] text-danger font-bold flex items-center gap-1">
                    <IconFlag size={12} /> تم الإبلاغ عن هذا المنشور
                  </p>
                  {post.reports?.map((r, ri) => (
                    <p key={ri} className="text-[10px] text-danger/70 mr-4">
                      {r.userName}: {r.reason}
                    </p>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-6 pt-3 border-t border-border-light">
                <button onClick={() => likePost(post.id)}
                  className={`flex items-center gap-2 text-xs font-bold transition-all active:scale-90 ${
                    post.likes.includes(user?.id || '') ? 'text-accent' : 'text-text-muted hover:text-accent'
                  }`}>
                  {post.likes.includes(user?.id || '') ? <IconHeartFilled size={18} /> : <IconHeart size={18} />}
                  {post.likes.length > 0 && <span>{post.likes.length}</span>}
                </button>
                <button onClick={() => setShowComments(s => ({ ...s, [post.id]: !s[post.id] }))}
                  className="flex items-center gap-2 text-xs font-bold text-text-muted hover:text-primary transition-colors">
                  <IconChat size={18} />
                  {post.comments.length > 0 && <span>{post.comments.length}</span>}
                </button>
              </div>

              {/* Comments */}
              {showComments[post.id] && (
                <div className="space-y-3 mt-1 animate-fade-in">
                  {post.comments.map(comment => (
                    <div key={comment.id} className={`bg-surface rounded-2xl p-4 border border-border-light ${comment.parentId ? 'mr-6 border-r-4 border-r-primary-100' : ''}`}>
                      {editingComment?.commentId === comment.id ? (
                        <div className="space-y-2">
                          <textarea value={editCommentContent} onChange={e => setEditCommentContent(e.target.value)}
                            className="w-full p-3 rounded-xl border border-border-light focus:border-primary focus:outline-none text-xs bg-white resize-none h-16" />
                          <div className="flex gap-2">
                            <button onClick={handleEditComment}
                              className="gradient-primary text-white px-4 py-2 rounded-xl text-[10px] font-bold flex items-center gap-1">
                              <IconCheck size={12} /> حفظ
                            </button>
                            <button onClick={() => setEditingComment(null)}
                              className="bg-white text-text-secondary px-4 py-2 rounded-xl text-[10px] font-bold border border-border-light">إلغاء</button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-start gap-3">
                            <div className="w-7 h-7 bg-primary-50 rounded-lg flex items-center justify-center text-[9px] font-extrabold text-primary flex-shrink-0 mt-0.5 border border-primary-100">
                              {comment.userName.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="text-[11px] font-bold text-text">{comment.userName}</p>
                                <div className="flex items-center gap-1">
                                  {comment.userId === user?.id && (
                                    <>
                                      <button onClick={() => { setEditingComment({postId: post.id, commentId: comment.id}); setEditCommentContent(comment.content); }}
                                        className="p-1 text-text-muted hover:text-primary transition-colors">
                                        <IconEdit size={11} />
                                      </button>
                                      <button onClick={() => deleteComment(post.id, comment.id)}
                                        className="p-1 text-text-muted hover:text-danger transition-colors">
                                        <IconTrash size={11} />
                                      </button>
                                    </>
                                  )}
                                  {isAdmin && comment.userId !== user?.id && (
                                    <button onClick={() => deleteComment(post.id, comment.id)}
                                      className="p-1 text-text-muted hover:text-danger transition-colors">
                                      <IconTrash size={11} />
                                    </button>
                                  )}
                                  <button onClick={() => setReplyingTo({postId: post.id, commentId: comment.id, userName: comment.userName})}
                                    className="p-1 text-text-muted hover:text-primary transition-colors">
                                    <IconReply size={11} />
                                  </button>
                                </div>
                              </div>
                              <p className="text-[11px] text-text-secondary mt-1 whitespace-pre-wrap leading-6 font-medium">{comment.content}</p>
                              <p className="text-[9px] text-text-muted mt-1.5 font-medium">{timeAgo(comment.createdAt)}</p>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ))}

                  {/* Reply indicator */}
                  {replyingTo?.postId === post.id && (
                    <div className="flex items-center gap-2 bg-primary-50 rounded-xl px-3 py-2 border border-primary-100">
                      <IconReply size={12} className="text-primary" />
                      <span className="text-[10px] font-bold text-primary">رد على {replyingTo.userName}</span>
                      <button onClick={() => setReplyingTo(null)} className="mr-auto text-primary">
                        <IconX size={12} />
                      </button>
                    </div>
                  )}

                  <div className="flex gap-2.5">
                    <input type="text" value={commentTexts[post.id] || ''}
                      onChange={e => setCommentTexts(t => ({ ...t, [post.id]: e.target.value }))}
                      placeholder={replyingTo?.postId === post.id ? `رد على ${replyingTo.userName}...` : 'اكتب تعليق...'}
                      className="flex-1 px-4 py-3 rounded-2xl border border-border-light focus:border-primary focus:outline-none text-xs bg-white transition-all shadow-card"
                      onKeyDown={e => { if (e.key === 'Enter') handleAddComment(post.id); }} />
                    <button onClick={() => handleAddComment(post.id)}
                      className="gradient-primary text-white px-4 rounded-2xl flex items-center justify-center active:scale-[0.97] shadow-sm">
                      <IconSend size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-surface rounded-2xl flex items-center justify-center mx-auto mb-4">
            <IconChat size={28} className="text-text-muted" />
          </div>
          <p className="text-text-secondary text-base font-bold">لا توجد منشورات بعد</p>
          <p className="text-text-muted text-xs mt-1 font-medium">كن أول من ينشر!</p>
        </div>
      )}
    </div>
  );
}
