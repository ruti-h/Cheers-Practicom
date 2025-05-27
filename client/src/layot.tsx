import type { ReactNode } from "react"
import Header from "../src/components/header"
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
