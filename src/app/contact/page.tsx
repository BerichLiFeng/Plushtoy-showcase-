"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getSupabaseClient } from "@/storage/database/supabase-client";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";

interface Contact {
  address: string;
  phone: string;
  email: string;
  wechat: string;
  working_hours: string;
  latitude: string;
  longitude: string;
}

interface SocialLink {
  id: number;
  platform_name: string;
  url: string;
}

export default function ContactPage() {
  const [contact, setContact] = useState<Contact | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const client = getSupabaseClient();
      const [contactRes, socialRes] = await Promise.all([
        client.from("contacts").select("*").maybeSingle(),
        client.from("social_links").select("*").eq("is_active", true).order("sort_order"),
      ]);
      if (contactRes.data) setContact(contactRes.data as Contact);
      if (socialRes.data) setSocialLinks(socialRes.data as SocialLink[]);
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // In a real app, you'd send this to an API endpoint
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="relative pt-28 pb-16 md:pt-36 md:pb-20 section-padding bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-xs tracking-[0.3em] text-primary/60 uppercase font-medium">联系我们</span>
          <h1 className="font-serif text-4xl md:text-5xl mt-4 text-foreground font-light">期待与您合作</h1>
          <p className="text-muted-foreground mt-4 max-w-lg mx-auto">
            无论是品牌合作、玩偶定制还是业务咨询，我们都在这里等您
          </p>
        </div>
      </section>

      <section className="py-16 section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact info */}
            <div>
              <h2 className="font-serif text-2xl text-foreground font-light mb-8">联系方式</h2>
              <div className="space-y-6">
                {contact?.address && (
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">地址</p>
                      <p className="text-sm text-foreground">{contact.address}</p>
                    </div>
                  </div>
                )}
                {contact?.phone && (
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Phone size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">电话</p>
                      <p className="text-sm text-foreground">{contact.phone}</p>
                    </div>
                  </div>
                )}
                {contact?.email && (
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Mail size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">邮箱</p>
                      <p className="text-sm text-foreground">{contact.email}</p>
                    </div>
                  </div>
                )}
                {contact?.wechat && (
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 01.598.082l1.584.926a.272.272 0 00.14.045c.134 0 .24-.11.24-.245 0-.06-.024-.12-.04-.178l-.325-1.233a.49.49 0 01.177-.554C23.028 18.48 24 16.82 24 14.98c0-3.21-3.094-5.932-7.062-6.122zm-2.18 3.072c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.97-.982z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">微信</p>
                      <p className="text-sm text-foreground">{contact.wechat}</p>
                    </div>
                  </div>
                )}
                {contact?.working_hours && (
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Clock size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">工作时间</p>
                      <p className="text-sm text-foreground">{contact.working_hours}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Social links */}
              {socialLinks.length > 0 && (
                <div className="mt-10">
                  <h3 className="text-xs text-muted-foreground uppercase tracking-wider mb-4">社交媒体</h3>
                  <div className="flex gap-3">
                    {socialLinks.map((link) => (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                      >
                        <span className="text-xs font-medium">{link.platform_name[0].toUpperCase()}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Contact form */}
            <div>
              <h2 className="font-serif text-2xl text-foreground font-light mb-8">发送消息</h2>
              {submitted ? (
                <div className="bg-primary/5 rounded-2xl p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                    <Send size={24} />
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-2">消息已发送</h3>
                  <p className="text-sm text-muted-foreground">感谢您的留言，我们将尽快与您联系！</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-xs text-muted-foreground mb-2">姓名</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder="请输入您的姓名"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-2">邮箱</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder="请输入您的邮箱"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-2">留言内容</label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                      placeholder="请输入您的留言内容..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                  >
                    <Send size={16} />
                    发送消息
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}