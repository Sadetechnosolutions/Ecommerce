package com.sadetech.category.Service;

import com.sadetech.category.Repo.CategoryRepository;
import com.sadetech.category.model.Category;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Optional<Category> getCategoryById(Long id) {
        return categoryRepository.findById(id);
    }

    public Category createCategory(Category category) {
        return categoryRepository.save(category);
    }

    public Optional<Category> updateCategory(Long id, Category categoryDetails) {
        return categoryRepository.findById(id).map(category -> {
            category.setName(categoryDetails.getName());
            category.setSlug(categoryDetails.getSlug());
            category.setVisibility(categoryDetails.getVisibility());
            category.setImage(categoryDetails.getImage());
            category.setTitle(categoryDetails.getTitle());
            category.setDescription(categoryDetails.getDescription());
            return categoryRepository.save(category);
        });
    }

    public boolean deleteCategory(Long id) {
        if (categoryRepository.existsById(id)) {
            categoryRepository.deleteById(id);
            return true;
        }
        return false;
    }
}