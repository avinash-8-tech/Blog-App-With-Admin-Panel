const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-background/95 backdrop-blur py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© {currentYear} BlogApp. All rights reserved.</p>
          
          <p className="flex items-center gap-1">
            Made with Next.js 
          </p>
          
          <div className="flex gap-4">
            <h3 className="hover:text-primary transition-colors cursor-pointer">
              Privacy
            </h3>
            <h3 className="hover:text-primary transition-colors cursor-pointer">
              Terms
            </h3>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer