import type { ReactNode } from "react"
import Header from "./Header-N"
import { Box } from "@mui/material"

interface LayoutProps {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <Header />
      <Box component="main" sx={{ paddingTop: "64px" }}>
        {children}
      </Box>
    </>
  )
}

export default Layout
