# Makefile to loop through all directories and run 'make package'

# Get all subdirectories
SUBDIRS := $(wildcard */)

# Default target
all: package-all

# Target to run 'make package' in all subdirectories
package-all:
	@for dir in $(SUBDIRS); do \
        if [ -f "$$dir/Makefile" ]; then \
            echo "Running make package in $$dir"; \
            $(MAKE) -C "$$dir" package; \
        fi; \
    done

# Alternative target using find command
package-all-find:
	@find . -maxdepth 2 -name "Makefile" -not -path "./Makefile" -execdir make package \;

.PHONY: all package-all package-all-find
