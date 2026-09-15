# Lunja Drive showcase

## Direction
Build `/lunja-drive` as a hybrid agency showcase: an editorial opening establishes credibility, then a filterable staff portfolio opens into detailed profiles and media carousels. The page will feel like a curated travel dossier rather than a file browser, using Lunja’s existing zine-inspired design language with a more polished, documentary tone.

## Page experience
- Add a standalone Lunja Drive header with clear Lunja branding, section links, and an agency contact action.
- Open with a full-bleed team image, a direct “Meet the people behind the village” message, trust signals, and a clear jump into the roster.
- Add a short credibility band explaining how profiles and placement records are organized and reviewed.
- Build role filters for All, Guest Experience, Food & Beverage, Operations, and Activities.
- Show six sample staff profiles with portrait, name, role, department, short bio, skills/languages, profile completeness, and reel/gallery actions.
- Open each person in an accessible profile overlay with biography, placement timeline, supporting images, and a playable branded reel treatment.
- Add a placements section using larger editorial image compositions, event details, participating roles, and a shared photo/video carousel.
- End with a high-confidence agency contact section linking to the existing contact page and email.

## Visual system
- Preserve the supplied Lunja palette and Barlow Condensed / Caveat Brush / DM Sans typography.
- Use cream paper, ink rules, coral/teal/yellow accents, hard shadows, restrained card rotation, taped labels, grain, and stamped verification motifs.
- Generate a cohesive set of warm, sunlit hospitality-team portraits and documentary placement imagery as clearly replaceable preview media.
- Keep interaction motion purposeful: filter transitions, subtle portrait movement, overlay entrances, and keyboard carousel controls, with reduced-motion support.

## Technical details
- Add the `/lunja-drive` route with unique title, description, Open Graph metadata, and one H1.
- Keep all sample staff and placement data local to the page so real records can replace it cleanly later.
- Use existing project assets where suitable and generated local assets for staff/placement placeholders; no external image hotlinks.
- Implement responsive behavior for mobile and desktop, focus handling, Escape/arrow-key controls, descriptive image alt text, and stable media dimensions.
- Add a discoverable Lunja Drive link from the main site navigation without embedding this page into the home page.
- Verify the route, filtering, profile overlay, gallery controls, and mobile/desktop layout in the live preview.
