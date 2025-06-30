'use client';

import Image from 'next/image';

export function BoltBadge() {
  return (
    <a
      href="https://bolt.new/"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed top-4 right-4 z-50 transition-transform hover:scale-110"
      aria-label="Built with Bolt.new"
    >
      <div className="relative w-[100px] h-[100px]">
        <Image
          src="/files_2476570-1751139500618-black_circle_360x360.svg"
          alt="Bolt.new"
          width={100}
          height={100}
          className="animate-spin-slow"
          style={{
            animation: 'spin 10s linear infinite'
          }}
        />
      </div>
    </a>
  );
}