import type { SVGProps } from "react";

export function MailIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M2 5L8.91302 8.92462C11.4387 10.3585 12.5613 10.3585 15.087 8.92462L22 5" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M10.5 19.5C10.0337 19.4939 9.56682 19.485 9.09883 19.4732C5.95033 19.3941 4.37608 19.3545 3.24496 18.2184C2.11383 17.0823 2.08114 15.5487 2.01577 12.4814C1.99475 11.4951 1.99474 10.5147 2.01576 9.52843C2.08114 6.46113 2.11382 4.92748 3.24495 3.79139C4.37608 2.6553 5.95033 2.61573 9.09882 2.53658C11.0393 2.4878 12.9607 2.48781 14.9012 2.53659C18.0497 2.61574 19.6239 2.65532 20.755 3.79141C21.8862 4.92749 21.9189 6.46114 21.9842 9.52844C21.9939 9.98251 21.9991 10.1965 21.9999 10.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M19 17C19 17.8284 18.3284 18.5 17.5 18.5C16.6716 18.5 16 17.8284 16 17C16 16.1716 16.6716 15.5 17.5 15.5C18.3284 15.5 19 16.1716 19 17ZM19 17V17.5C19 18.3284 19.6716 19 20.5 19C21.3284 19 22 18.3284 22 17.5V17C22 14.5147 19.9853 12.5 17.5 12.5C15.0147 12.5 13 14.5147 13 17C13 19.4853 15.0147 21.5 17.5 21.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>                      
  );
}

export function PhoneIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M5 9C5 5.70017 5 4.05025 6.02513 3.02513C7.05025 2 8.70017 2 12 2C15.2998 2 16.9497 2 17.9749 3.02513C19 4.05025 19 5.70017 19 9V15C19 18.2998 19 19.9497 17.9749 20.9749C16.9497 22 15.2998 22 12 22C8.70017 22 7.05025 22 6.02513 20.9749C5 19.9497 5 18.2998 5 15V9Z" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M11 19H13" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 2L9.089 2.53402C9.28188 3.69129 9.37832 4.26993 9.77519 4.62204C10.1892 4.98934 10.7761 5 12 5C13.2239 5 13.8108 4.98934 14.2248 4.62204C14.6217 4.26993 14.7181 3.69129 14.911 2.53402L15 2" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  );
}

export function MapPinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M22 10V9.21749C22 7.27787 22 6.30807 21.4142 5.7055C20.8284 5.10294 19.8856 5.10294 18 5.10294H15.9214C15.004 5.10294 14.9964 5.10116 14.1715 4.68834L10.8399 3.02114C9.44884 2.32504 8.75332 1.97699 8.01238 2.00118C7.27143 2.02537 6.59877 2.41808 5.25345 3.20351L4.02558 3.92037C3.03739 4.49729 2.54329 4.78576 2.27164 5.26564C2 5.74553 2 6.32993 2 7.49873V15.7157C2 17.2514 2 18.0193 2.34226 18.4467C2.57001 18.731 2.88916 18.9222 3.242 18.9856C3.77226 19.0808 4.42148 18.7018 5.71987 17.9437C6.60156 17.429 7.45011 16.8944 8.50487 17.0394C9.38869 17.1608 10.21 17.7185 11 18.1138" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 2L8 17" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M15 5V9.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M18.3083 21.6835C18.0915 21.8865 17.8017 22 17.5001 22C17.1985 22 16.9087 21.8865 16.6919 21.6835C14.7063 19.813 12.0455 17.7235 13.3431 14.6898C14.0447 13.0496 15.7289 12 17.5001 12C19.2713 12 20.9555 13.0496 21.6571 14.6898C22.9531 17.7196 20.2988 19.8194 18.3083 21.6835Z" stroke="white" strokeWidth="1.5"/>
      <path d="M17.5 16.5H17.509" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
