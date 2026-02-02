import React from 'react'
import { Home, Calendar, User, Tag } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Blog — AI²SARS',
  description: 'Latest articles and insights on interviews, resumes, and career development',
}

export default function BlogPage() {
  const posts = [
    {
      id: 1,
      title: 'How to Ace Technical Interviews: A Comprehensive Guide',
      excerpt: 'Learn proven strategies to confidently solve coding problems and ace your technical interview',
      date: 'Feb 1, 2026',
      author: 'Sarah Chen',
      category: 'Interview Tips',
      readTime: '8 min',
      image: '#2ecc71'
    },
    {
      id: 2,
      title: 'The Power of the STAR Method in Behavioral Interviews',
      excerpt: 'Master the Situation, Task, Action, Result framework to tell compelling stories in interviews',
      date: 'Jan 28, 2026',
      author: 'Michael Rodriguez',
      category: 'Career',
      readTime: '6 min',
      image: '#3498db'
    },
    {
      id: 3,
      title: '5 Resume Mistakes That Could Cost You the Job',
      excerpt: 'Discover common resume pitfalls and how to fix them to get more interview invitations',
      date: 'Jan 25, 2026',
      author: 'Emma Thompson',
      category: 'Resume',
      readTime: '7 min',
      image: '#e74c3c'
    },
    {
      id: 4,
      title: 'Why ATS-Friendly Resumes Matter in 2026',
      excerpt: 'Understanding Applicant Tracking Systems and how to format your resume for maximum ATS compatibility',
      date: 'Jan 22, 2026',
      author: 'David Park',
      category: 'ATS',
      readTime: '9 min',
      image: '#9b59b6'
    },
    {
      id: 5,
      title: 'Building Confidence Before Your First Interview',
      excerpt: 'Practical techniques to manage interview anxiety and show up as your best self',
      date: 'Jan 19, 2026',
      author: 'Jessica Williams',
      category: 'Interview Tips',
      readTime: '5 min',
      image: '#f39c12'
    },
    {
      id: 6,
      title: 'From Resume to Offer: The Job Search Timeline',
      excerpt: 'A realistic timeline for the job search process and tips to stay motivated throughout',
      date: 'Jan 16, 2026',
      author: 'Alex Kumar',
      category: 'Career',
      readTime: '10 min',
      image: '#16a085'
    },
  ]

  const categories = ['All', 'Interview Tips', 'Resume', 'Career', 'ATS', 'Technology']

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="border-b border-gray-200 bg-white sticky top-0 z-40">
        <div className="mx-auto max-w-6xl px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors text-sm">
              <Home className="w-4 h-4" />
              Back to Home
            </Link>
            <h1 className="text-2xl font-bold text-emerald-600">Blog</h1>
            <div className="w-24"></div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-16">
        <section className="mb-16 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Latest Articles & Insights</h2>
          <p className="text-xl text-gray-600">Tips, strategies, and advice to help you succeed in your career</p>
        </section>

        {/* Category Filter */}
        <div className="mb-12 flex flex-wrap gap-3 justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                cat === 'All'
                  ? 'bg-emerald-600 text-white'
                  : 'border border-gray-300 text-gray-700 hover:border-emerald-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {posts.map((post) => (
            <article key={post.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white">
              <div className="h-48 bg-gradient-to-br from-gray-100" style={{ backgroundImage: `linear-gradient(135deg, ${post.image}20 0%, ${post.image}10 100%)` }}></div>
              
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">
                    {post.category}
                  </span>
                  <span className="text-xs text-gray-600">{post.readTime}</span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  <a href="#" className="hover:text-emerald-600 transition-colors">
                    {post.title}
                  </a>
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="text-xs text-gray-600">
                    <div className="flex items-center gap-1 mb-1">
                      <User className="w-3 h-3" />
                      {post.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {post.date}
                    </div>
                  </div>
                  <a href="#" className="text-emerald-600 hover:text-emerald-700 font-medium text-sm">
                    Read →
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter Section */}
        <section className="p-8 bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200 rounded-lg">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Subscribe to Our Newsletter</h2>
            <p className="text-gray-700 mb-6">Get weekly tips, interview strategies, and career advice delivered to your inbox</p>
            
            <form className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
            <p className="text-xs text-gray-600 mt-3">No spam, ever. Unsubscribe anytime.</p>
          </div>
        </section>
      </div>
    </main>
  )
}
