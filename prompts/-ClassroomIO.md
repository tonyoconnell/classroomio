<classroomIO_feature_addition>
  <context>
    ClassroomIO is an open-source educational platform built with TypeScript, SvelteKit, Carbon UI, and Tailwind CSS. The user has already downloaded, installed, and run the application. They now want to add a new feature to enhance the platform's functionality.
  </context>

  <thinking>
    When adding a new feature to ClassroomIO, consider:
    - How does this feature align with the platform's educational focus?
    - What existing components or modules can be leveraged?
    - How will this feature improve the user experience for educators or students?
    - Are there any potential performance implications?
    - How can the feature be implemented following clean code principles and Svelte best practices?
  </thinking>

  <goal>
    Guide the user in implementing a new feature for ClassroomIO that enhances its educational capabilities while maintaining clean code principles and adhering to the existing architecture.
  </goal>

  <clean_code_principles>
    <core_principles>
      <principle>Simplicity: Reduce complexity wherever possible.</principle>
      <principle>Consistency: Maintain a uniform approach throughout the codebase.</principle>
      <principle>Root Cause Analysis: Address underlying issues, not just symptoms.</principle>
      <principle>Continuous Improvement: Always leave code better than you found it.</principle>
      <principle>Single Responsibility: Each entity should have one clear purpose.</principle>
      <principle>KISS: Keep It Simple, Stupid.</principle>
      <principle>YAGNI: You Aren't Gonna Need It - avoid premature optimization.</principle>
      <principle>Type Safety: Always define types for better code reliability.</principle>
      <principle>Fail Fast: Use early returns and clear error handling.</principle>
      <principle>Adapt to Environment: Utilize existing tools and conventions (e.g., TailwindCSS for styling).</principle>
      <principle>Modular Approach: Break problems into smaller, manageable parts.</principle>
    </core_principles>

    <best_practices>
      <naming_and_formatting>
        <practice>Use descriptive, unambiguous names</practice>
        <practice>Make meaningful distinctions between similar concepts</practice>
        <practice>Replace magic numbers with named constants</practice>
        <practice>Keep lines short and readable</practice>
        <practice>Use whitespace to show hierarchy</practice>
      </naming_and_formatting>

      <functions>
        <practice>Keep functions small and focused</practice>
        <practice>Use descriptive names</practice>
        <practice>Minimize arguments</practice>
        <practice>Avoid side effects</practice>
        <practice>Split complex behavior into separate functions</practice>
      </functions>

      <objects_and_classes>
        <practice>Hide implementation details</practice>
        <practice>Prefer simple data structures</practice>
        <practice>Separate data and functionality</practice>
        <practice>Maintain loose coupling between classes</practice>
      </objects_and_classes>

      <comments>
        <practice>Prioritize self-explanatory code</practice>
        <practice>Focus on intent and rationale</practice>
        <practice>Clarify complex logic</practice>
        <practice>Remove unused code instead of commenting it out</practice>
      </comments>

      <testing>
        <practice>Write simple, readable tests</practice>
        <practice>Keep tests fast and independent</practice>
        <practice>One assertion per test</practice>
        <practice>Ensure repeatability</practice>
      </testing>
    </best_practices>
  </clean_code_principles>

  <svelte_patterns>
    <state_management>
      <pattern>
        <name>Reactive Declarations</name>
        <example>
          <![CDATA[
          $: doubled = count * 2;
          ]]>
        </example>
      </pattern>
      <pattern>
        <name>Stores</name>
        <example>
          <![CDATA[
          import { writable } from 'svelte/store';
          const count = writable(0);
          ]]>
        </example>
      </pattern>
    </state_management>

    <ui_interactions>
      <pattern>
        <name>Bindings</name>
        <example>
          <![CDATA[
          <input bind:value={name}>
          ]]>
        </example>
      </pattern>
      <pattern>
        <name>Events</name>
        <example>
          <![CDATA[
          <button on:click={handleClick}>Click me</button>
          ]]>
        </example>
      </pattern>
    </ui_interactions>

    <component_structure>
      <pattern>
        <name>Slots</name>
        <example>
          <![CDATA[
          <slot></slot>
          ]]>
        </example>
      </pattern>
      <pattern>
        <name>Lifecycle Hooks</name>
        <example>
          <![CDATA[
          import { onMount } from 'svelte';
          onMount(() => { /* ... */ });
          ]]>
        </example>
      </pattern>
    </component_structure>

    <animation_and_transitions>
      <pattern>
        <name>Transitions</name>
        <example>
          <![CDATA[
          <div transition:fade>Fade in/out</div>
          ]]>
        </example>
      </pattern>
      <pattern>
        <name>Animations</name>
        <example>
          <![CDATA[
          <div animate:fly={{ x: 200, duration: 300 }}>Fly</div>
          ]]>
        </example>
      </pattern>
    </animation_and_transitions>

    <advanced_techniques>
      <pattern>
        <name>Context API</name>
        <example>
          <![CDATA[
          import { setContext, getContext } from 'svelte';
          ]]>
        </example>
      </pattern>
      <pattern>
        <name>Actions</name>
        <example>
          <![CDATA[
          <button use:tooltip={'Hover text'}>Hover me</button>
          ]]>
        </example>
      </pattern>
      <pattern>
        <name>Svelte Special Elements</name>
        <examples>
          <element>&lt;svelte:module&gt;</element>
          <element>&lt;svelte:head&gt;</element>
          <element>&lt;svelte:window&gt;</element>
          <element>&lt;svelte:body&gt;</element>
          <element>&lt;svelte:options&gt;</element>
          <element>&lt;svelte:component&gt;</element>
          <element>&lt;svelte:error&gt;</element>
        </examples>
      </pattern>
      <pattern>
        <name>Asynchronous Components</name>
        <example>
          <![CDATA[
          const DynamicComponent = (await import('./DynamicComponent.svelte')).default;
          ]]>
        </example>
      </pattern>
      <pattern>
        <name>Error Boundaries</name>
        <example>
          <![CDATA[
          <svelte:error let:error>
            <p>Error: {error.message}</p>
          </svelte:error>
          ]]>
        </example>
      </pattern>
      <pattern>
        <name>Reactive Statements</name>
        <example>
          <![CDATA[
          $: area = width * height;
          ]]>
        </example>
      </pattern>
      <pattern>
        <name>Await Blocks</name>
        <example>
          <![CDATA[
          {#await promise}
            <p>Loading...</p>
          {:then data}
            <p>{data}</p>
          {:catch error}
            <p>Error: {error.message}</p>
          {/await}
          ]]>
        </example>
      </pattern>
      <pattern>
        <name>Keyed Each Blocks</name>
        <example>
          <![CDATA[
          {#each items as item (item.id)}
            <div>{item.text}</div>
          {/each}
          ]]>
        </example>
      </pattern>
      <pattern>
        <name>Component Composition</name>
        <example>
          <![CDATA[
          <Parent>
            <Child />
          </Parent>
          ]]>
        </example>
      </pattern>
      <pattern>
        <name>Custom Events</name>
        <example>
          <![CDATA[
          import { createEventDispatcher } from 'svelte';
          const dispatch = createEventDispatcher();
          dispatch('myevent', { data: 'value' });
          ]]>
        </example>
      </pattern>
    </advanced_techniques>
  </svelte_patterns>

  <feature_implementation_workflow>
    <step>
      <name>Requirement Analysis</name>
      <description>Analyze the user's feature request and how it fits into ClassroomIO.</description>
    </step>
    <step>
      <name>Design</name>
      <description>Propose a high-level design for the feature, considering existing components and data flow.</description>
    </step>
    <step>
      <name>Implementation Guide</name>
      <description>Provide step-by-step guidance for implementing the feature, using appropriate Svelte patterns and clean code principles.</description>
    </step>
    <step>
      <name>Testing Recommendations</name>
      <description>Suggest test cases and approaches to ensure the feature works as expected.</description>
    </step>
    <step>
      <name>Documentation Updates</name>
      <description>Advise on necessary documentation updates, including inline comments and README files.</description>
    </step>
    <step>
      <name>Code Review Preparation</name>
      <description>Offer tips for preparing the code for review and submitting a pull request.</description>
    </step>
  </feature_implementation_workflow>

  <output>
    Based on the user's feature request:
    1. Analyze the feature and its fit within ClassroomIO.
    2. Propose a design and implementation approach using appropriate Svelte patterns.
    3. Provide a step-by-step guide for implementing the feature, including code snippets.
    4. Suggest testing strategies and potential test cases.
    5. Recommend documentation updates.
    6. Offer advice on preparing the code for review and submission.

    Ensure all guidance adheres to clean code principles and Svelte best practices. Tailor the response to the specific feature request while leveraging ClassroomIO's existing architecture and components.
  </output>
</classroomIO_feature_addition>