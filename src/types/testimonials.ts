/* eslint-disable @typescript-eslint/no-empty-object-type */
// src/types/testimonials.ts

export interface Testimonial {
    /**
     * Full name of the person giving the testimonial
     */
    name: string;
    
    /**
     * Social media username or handle
     */
    username: string;
    
    /**
     * URL to the profile image of the person
     */
    userImage: string;
    
    /**
     * Name of the company the person represents
     */
    companyName: string;
    
    /**
     * URL to the company logo
     */
    companyLogo: string;
    
    /**
     * Star rating (1-5)
     */
    rating: number;
    
    /**
     * The testimonial text, can include <highlight> tags for emphasizing text
     */
    review: string;
  }
  
  export interface HighlightedTextProps {
    /**
     * Text that may contain <highlight> tags to be parsed
     */
    text: string;
  }
  
  export interface TestimonialCardProps extends Testimonial {}
  
  /**
   * Helper function to split an array into a specified number of rows
   */
  export type SplitIntoRowsFunction = <T>(array: T[], rows: number) => T[][];