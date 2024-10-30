package com.sadetech.category.model;

import com.sadetech.category.ennum.VisibilityStatus;
import jakarta.persistence.*;


@Entity
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String slug;

    @Enumerated(EnumType.STRING)
    private VisibilityStatus visibility; // Use the enum here

    @Column(nullable = true)
    private String image;
    private String title;
    private String description;

    // Constructors
    public Category() {}

    public Category(String name, String slug, VisibilityStatus visibility, String image, String title, String description) {
        this.name = name;
        this.slug = slug;
        this.visibility = visibility;
        this.image = image;
        this.title = title;
        this.description = description;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public VisibilityStatus getVisibility() {
        return visibility;
    }

    public void setVisibility(VisibilityStatus visibility) {
        this.visibility = visibility;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
