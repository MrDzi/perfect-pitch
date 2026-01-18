import React, { ReactElement, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useNavigateWithTransition from "../../hooks/useNavigateWithTransition";
import { Helmet } from "react-helmet";
import PageWrapper from "../../components/page-wrapper";
import "./blog.scss";
import { renderMarkdown } from "./helpers";
import { blogPosts, BlogPost } from "./blog-posts";

const POSTS_PER_PAGE = 5;

const Blog = (): ReactElement => {
  const { id } = useParams<{ id: string }>();
  const [navigateWithTransition] = useNavigateWithTransition();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  // Find the selected post based on URL parameter
  const selectedPost = id ? blogPosts.find((post) => post.id === id) : null;

  const totalPages = Math.ceil(blogPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const currentPosts = blogPosts.slice(startIndex, endIndex);

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      // Use requestAnimationFrame for better timing with DOM updates
      requestAnimationFrame(() => {
        window.scrollTo(0, 0);
        // Double requestAnimationFrame for better reliability on slow devices
        requestAnimationFrame(() => {
          window.scrollTo(0, 0);
        });
      });
    }
  };

  const handlePostClick = (post: BlogPost) => {
    navigateWithTransition(`/blog/${post.id}`);
  };

  const handleBackToList = () => {
    navigate("/blog");
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    scrollToTop();
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          className={`pagination-btn ${i === currentPage ? "active" : ""}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="pagination">
        <button
          className="pagination-btn"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {pages}
        <button
          className="pagination-btn"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    );
  };

  // Handle case where blog post ID is provided but post doesn't exist
  if (id && !selectedPost) {
    return (
      <>
        <Helmet>
          <title>Blog Post Not Found | CheckYourPitch Blog</title>
          <meta name="description" content="The blog post you're looking for doesn't exist or may have been moved." />
        </Helmet>
        <PageWrapper>
          <div className="blog-page">
            <div className="container">
              <button className="button button--no-border back-button" onClick={handleBackToList}>
                ← <span>Back to Blog</span>
              </button>
              <div className="blog-post-not-found">
                <h1>Blog Post Not Found</h1>
                <p>The blog post you&apos;re looking for doesn&apos;t exist or may have been moved.</p>
              </div>
            </div>
          </div>
        </PageWrapper>
      </>
    );
  }

  if (selectedPost) {
    return (
      <>
        <Helmet>
          <title>{selectedPost.title} | CheckYourPitch Blog</title>
          <meta name="description" content={selectedPost.excerpt} />
          <meta property="og:title" content={`${selectedPost.title} | CheckYourPitch Blog`} />
          <meta property="og:description" content={selectedPost.excerpt} />
        </Helmet>
        <PageWrapper>
          <div className="blog-page">
            <div className="container">
              <button className="button button--no-border back-button" onClick={handleBackToList}>
                ← <span>Back to Blog</span>
              </button>
              <article className="blog-post-full">
                <header className="blog-post-header">
                  <h1>{selectedPost.title}</h1>
                  <div className="blog-post-meta">
                    <span className="blog-post-date">{selectedPost.date}</span>
                    <span className="blog-post-divider"> • </span>
                    <span className="blog-post-read-time">{selectedPost.readTime}</span>
                  </div>
                </header>
                <div className="blog-post-content">{renderMarkdown(selectedPost.content)}</div>
              </article>
            </div>
          </div>
        </PageWrapper>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Blog | CheckYourPitch - Pitch Training Tips and Insights</title>
        <meta
          name="description"
          content="Discover expert tips and insights on pitch training, ear training, and improving your musical abilities. Learn from our comprehensive guides and tutorials."
        />
        <meta property="og:title" content="Blog | CheckYourPitch - Pitch Training Tips and Insights" />
        <meta
          property="og:description"
          content="Discover expert tips and insights on pitch training, ear training, and improving your musical abilities. Learn from our comprehensive guides and tutorials."
        />
      </Helmet>
      <PageWrapper withBackButton>
        <div className="blog-page">
          <div className="container">
            <header className="blog-header">
              <h1>Blog</h1>
              <p>Tips, insights, and guides to help you improve your pitch and musical abilities.</p>
            </header>

            <div className="blog-posts">
              {currentPosts.map((post) => (
                <article key={post.id} className="blog-post-card" onClick={() => handlePostClick(post)}>
                  <h2 className="blog-post-title">{post.title}</h2>
                  <div className="blog-post-meta">
                    <span className="blog-post-date">{post.date}</span>
                    <span className="blog-post-divider"> • </span>
                    <span className="blog-post-read-time">{post.readTime}</span>
                  </div>
                  <p className="blog-post-excerpt">{post.excerpt}</p>
                  <span className="blog-post-cta">Read More →</span>
                </article>
              ))}
            </div>

            {renderPagination()}
          </div>
        </div>
      </PageWrapper>
    </>
  );
};

export default Blog;
