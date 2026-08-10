#!/usr/bin/env ruby

require "open3"

ROOT = File.expand_path("..", __dir__)

def image_dimensions(path)
  output, status = Open3.capture2("sips", "-g", "pixelWidth", "-g", "pixelHeight", path)
  return unless status.success?

  width = output[/pixelWidth:\s*(\d+)/, 1]
  height = output[/pixelHeight:\s*(\d+)/, 1]
  return unless width && height

  [width, height]
end

updated_images = 0

Dir.glob(File.join(ROOT, "*.html")).sort.each do |html_path|
  html = File.read(html_path, encoding: "UTF-8")
  changed = false

  html.gsub!(/<img\b[^>]*>/mi) do |tag|
    src = tag[/\bsrc="([^"]+)"/i, 1]
    next tag unless src&.start_with?("assets/")

    needs_width = !tag.match?(/\bwidth="\d+"/i)
    needs_height = !tag.match?(/\bheight="\d+"/i)
    next tag unless needs_width || needs_height

    asset_path = File.join(ROOT, src.split(/[?#]/, 2).first)
    next tag unless File.file?(asset_path)

    dimensions = image_dimensions(asset_path)
    next tag unless dimensions

    width, height = dimensions
    attributes = []
    attributes << %(width="#{width}") if needs_width
    attributes << %(height="#{height}") if needs_height
    changed = true
    updated_images += 1
    tag.sub(/<img\b/i, "<img #{attributes.join(" ")}")
  end

  File.write(html_path, html, encoding: "UTF-8") if changed
end

puts "Added intrinsic dimensions to #{updated_images} images."
